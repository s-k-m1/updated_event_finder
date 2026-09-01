import { SavedModel } from "../models/SavedModel.js";
import { NotificationModel } from "../models/NotificationModel.js";
import { EventModel } from "../models/EventModel.js";

export const SavedController = {
  async list(req, res, next) {
    try {
      const events = await SavedModel.findByUserId(req.user.id);
      res.json(events);
    } catch (err) {
      next(err);
    }
  },

  async ids(req, res, next) {
    try {
      const ids = await SavedModel.findIdsByUserId(req.user.id);
      res.json({ ids });
    } catch (err) {
      next(err);
    }
  },

  async save(req, res, next) {
    try {
      const event = await EventModel.findById(req.params.id);
      if (!event) return res.status(404).json({ error: "Event not found" });

      await SavedModel.add(req.user.id, event.id);
      await NotificationModel.create(
        req.user.id,
        "Event saved",
        `You saved "${event.title}". We'll remind you when it's happening.`
      );
      res.status(201).json({ saved: true, id: event.id });
    } catch (err) {
      next(err);
    }
  },

  async unsave(req, res, next) {
    try {
      await SavedModel.remove(req.user.id, req.params.id);
      res.json({ saved: false, id: req.params.id });
    } catch (err) {
      next(err);
    }
  }
};