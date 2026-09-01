import { NotificationModel } from "../models/NotificationModel.js";
import { UserModel } from "../models/UserModel.js";

export const NotificationController = {
  async index(req, res, next) {
    try {
      const notifications = await NotificationModel.findByUserId(req.user.id);
      const unreadCount = await NotificationModel.unreadCount(req.user.id);
      res.json({ notifications, unreadCount });
    } catch (err) {
      next(err);
    }
  },

  async markAllRead(req, res, next) {
    try {
      await NotificationModel.markAllRead(req.user.id);
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  },

  async markRead(req, res, next) {
    try {
      await NotificationModel.markRead(req.user.id, req.params.id);
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  }
};

export const NotificationAdminController = {
  async list(req, res, next) {
    try {
      res.json({ notifications: await NotificationModel.findAll() });
    } catch (err) {
      next(err);
    }
  },

  async send(req, res, next) {
    try {
      const { title, message, userId } = req.body;
      if (!title || !message) {
        return res.status(400).json({ error: "Title and message are required" });
      }
      if (userId) {
        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });
        await NotificationModel.create(userId, title, message);
        return res.status(201).json({ ok: true, recipients: 1 });
      }
      const recipients = await NotificationModel.createForAll(title, message);
      res.status(201).json({ ok: true, recipients });
    } catch (err) {
      next(err);
    }
  }
};