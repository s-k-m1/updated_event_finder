import { ContentModel, SubscriberModel } from "../models/ContentModel.js";
import { EventModel } from "../models/EventModel.js";
import { CategoryModel } from "../models/CategoryModel.js";
import { UserModel } from "../models/UserModel.js";
import { RegistrationModel } from "../models/RegistrationModel.js";
import { query } from "../db.js";

export const ContentController = {
  async get(req, res, next) {
    try {
      const value = await ContentModel.get(req.params.key);
      if (value === undefined) return res.status(404).json({ error: "Content not found" });
      res.json(value);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const content = await ContentModel.set(req.params.key, req.body);
      res.json(content);
    } catch (err) {
      next(err);
    }
  },

  async subscribe(req, res, next) {
    try {
      const { email } = req.body;
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: "A valid email is required" });
      }
      await SubscriberModel.subscribe(email);
      res.status(201).json({ message: "Subscribed successfully" });
    } catch (err) {
      next(err);
    }
  }
};

export const DashboardController = {
  async stats(req, res, next) {
    try {
      const [events, categories, users, subscribers, registrations] = await Promise.all([
        EventModel.count(),
        CategoryModel.count(),
        UserModel.count(),
        SubscriberModel.count(),
        RegistrationModel.count(),
      ]);
      res.json({ events, categories, users, subscribers, registrations });
    } catch (err) {
      next(err);
    }
  },

  async users(req, res, next) {
    try {
      const { rows } = await query(
        `SELECT id, full_name, email, phone, role, created_at FROM users ORDER BY id ASC`
      );
      res.json(rows);
    } catch (err) {
      next(err);
    }
  },

  async subscribers(req, res, next) {
    try {
      res.json(await SubscriberModel.findAll());
    } catch (err) {
      next(err);
    }
  },

  async content(req, res, next) {
    try {
      res.json(await ContentModel.findAll());
    } catch (err) {
      next(err);
    }
  }
};

export const UserAdminController = {
  async updateRole(req, res, next) {
    try {
      const user = await UserModel.updateRole(req.params.id, req.body.role);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const user = await UserModel.update(req.params.id, req.body);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (err) {
      next(err);
    }
  },

  async destroy(req, res, next) {
    try {
      const deleted = await UserModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: "User not found" });
      res.json({ message: "User deleted" });
    } catch (err) {
      next(err);
    }
  }
};