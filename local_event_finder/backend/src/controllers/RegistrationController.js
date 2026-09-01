import { RegistrationModel } from "../models/RegistrationModel.js";
import { NotificationModel } from "../models/NotificationModel.js";
import { EventModel } from "../models/EventModel.js";
import { UserModel } from "../models/UserModel.js";
import { Mailer } from "../services/mailer.js";
import { initiateKhaltiPayment, lookupKhaltiPayment } from "../services/khalti.js";
import { randomUUID } from "node:crypto";

// Khalti's initiate API rejects customer_info.phone longer than 16 chars.
// Normalize to bare digits so values like "+1 (473) 568-3624" don't fail.
function sanitizePhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits.slice(0, 16);
}

async function notifyRegistration(userId, event, paymentStatus) {
  const user = await UserModel.findById(userId);
  const paid = paymentStatus === "paid";
  const title = paid ? "Payment received — Registration confirmed" : "Registration confirmed";
  const message = paid
    ? `Payment received. You're registered for "${event.title}". See you there!`
    : `You're registered for "${event.title}". See you there!`;
  await NotificationModel.create(userId, title, message);
  if (user?.email) {
    try {
      if (paid) {
        const amount = `Rs. ${Number(event.price_value) || 0}`;
        await Mailer.sendPaymentReceived(user.email, user.full_name || "there", event.title, amount);
      } else {
        await Mailer.sendRegistrationConfirmed(user.email, user.full_name || "there", event.title);
      }
    } catch (err) {
      console.error("Failed to send registration email:", err.message);
    }
  }
}

export const RegistrationController = {
  async list(req, res, next) {
    try {
      res.json(await RegistrationModel.findByUserId(req.user.id));
    } catch (err) {
      next(err);
    }
  },

  async status(req, res, next) {
    try {
      const event = await EventModel.findBySlug(req.params.slug);
      if (!event) return res.status(404).json({ error: "Event not found" });
      const row = await RegistrationModel.findByUserAndEvent(req.user.id, event.id);
      res.json({
        registered: !!row,
        paymentStatus: row?.payment_status || null,
        khaltiPidx: row?.khalti_pidx || null,
      });
    } catch (err) {
      next(err);
    }
  },

  async register(req, res, next) {
    try {
      const event = await EventModel.findBySlug(req.params.slug);
      if (!event) return res.status(404).json({ error: "Event not found" });

      const price = Number(event.price_value) || 0;

      // Free events: register immediately, no payment.
      if (price <= 0) {
        const added = await RegistrationModel.add(req.user.id, event.id);
        if (added) await notifyRegistration(req.user.id, event, "free");
        return res.status(201).json({
          registered: true,
          free: true,
          id: event.id,
          paymentMethod: null,
          paymentStatus: "paid",
        });
      }

      // Paid events: initiate Khalti KPG-2 payment (server-side).
      // Guard against duplicate charges: block re-payment only if the user is
      // already *paid*. If there's an abandoned/never-completed pending
      // registration, allow re-initiating (the new pidx replaces the old).
      const existing = await RegistrationModel.findByUserAndEvent(req.user.id, event.id);
      if (existing && existing.payment_status === "paid") {
        return res.status(200).json({
          registered: true,
          pending: false,
          id: event.id,
          message: "You're already registered for this event.",
        });
      }

      const purchaseOrderId = `LEF-${randomUUID()}`;
      const origin = `${req.protocol}://${req.get("host")}`;
      const returnUrl = `${origin}/payment/return`;
      const websiteUrl = origin;

      const customer = await UserModel.findById(req.user.id);
      const { pidx, paymentUrl } = await initiateKhaltiPayment({
        amount: Math.round(price * 100), // paisa
        purchaseOrderId,
        purchaseOrderName: event.title,
        returnUrl,
        websiteUrl,
        customer: customer
          ? { name: customer.full_name, email: customer.email, phone: sanitizePhone(customer.phone) }
          : undefined,
      });

      await RegistrationModel.addPending(req.user.id, event.id, pidx);

      return res.status(201).json({
        registered: false,
        pending: true,
        id: event.id,
        pidx,
        paymentUrl,
      });
    } catch (err) {
      next(err);
    }
  },

  async confirm(req, res, next) {
    try {
      const { pidx } = req.body || {};
      if (!pidx) return res.status(400).json({ error: "Missing pidx." });

      const lookup = await lookupKhaltiPayment(pidx);
      if (!lookup.success) {
        return res.status(402).json({ error: "Khalti payment verification failed.", detail: lookup.data });
      }

      const registration = await RegistrationModel.findByPidx(pidx, req.user.id);
      if (!registration) return res.status(404).json({ error: "Registration not found." });

      // Only "Completed" counts as success (per Khalti docs).
      if (lookup.data.status !== "Completed") {
        return res.status(202).json({
          confirmed: false,
          status: lookup.data.status,
          message: "Payment is not completed yet.",
        });
      }

      const updated = await RegistrationModel.markPaid(pidx);
      if (updated) {
        const event = await EventModel.findById(updated.event_id);
        if (event) await notifyRegistration(updated.user_id, event, "paid");
      }

      return res.json({ confirmed: true, status: "Completed", id: registration.event_id });
    } catch (err) {
      next(err);
    }
  },

  async unregister(req, res, next) {
    try {
      const event = await EventModel.findBySlug(req.params.slug);
      if (!event) return res.status(404).json({ error: "Event not found" });
      await RegistrationModel.remove(req.user.id, event.id);
      res.json({ registered: false, id: event.id });
    } catch (err) {
      next(err);
    }
  }
};
