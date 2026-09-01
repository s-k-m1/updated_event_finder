import { EventModel } from "../models/EventModel.js";
import { CategoryModel } from "../models/CategoryModel.js";
import { matchesDateFilter } from "../models/EventModel.js";
import { query } from "../db.js";

export const EventController = {
  async index(req, res, next) {
    try {
      const events = await EventModel.findAll(req.query);
      res.json(events);
    } catch (err) {
      next(err);
    }
  },

  async locations(req, res, next) {
    try {
      const { rows } = await query(
        "SELECT DISTINCT city FROM events WHERE city <> '' ORDER BY city"
      );
      res.json(rows.map((r) => r.city));
    } catch (err) {
      next(err);
    }
  },

  async near(req, res, next) {
    try {
      const lat = parseFloat(req.query.lat);
      const lng = parseFloat(req.query.lng);
      const radius = parseInt(req.query.radius, 10) || 30;
      if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({ error: "lat and lng query params are required" });
      }
      res.json(await EventModel.findNearby(lat, lng, radius));
    } catch (err) {
      next(err);
    }
  },

  async featured(req, res, next) {
    try {
      const events = await EventModel.findFeatured();
      if (["today", "week", "month"].includes(req.query.date)) {
        return res.json(events.filter((e) => matchesDateFilter(e.date, req.query.date)));
      }
      res.json(events);
    } catch (err) {
      next(err);
    }
  },

  async trending(req, res, next) {
    try {
      res.json(await EventModel.findTrending());
    } catch (err) {
      next(err);
    }
  },

  async live(req, res, next) {
    try {
      res.json(await EventModel.findLive());
    } catch (err) {
      next(err);
    }
  },

  async show(req, res, next) {
    try {
      const event = await EventModel.findBySlug(req.params.slug);
      if (!event) return res.status(404).json({ error: "Event not found" });
      res.json(event);
    } catch (err) {
      next(err);
    }
  },

  async store(req, res, next) {
    try {
      const event = await EventModel.create(req.body);
      res.status(201).json(event);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const event = await EventModel.update(req.params.id, req.body);
      if (!event) return res.status(404).json({ error: "Event not found" });
      res.json(event);
    } catch (err) {
      next(err);
    }
  },

  async destroy(req, res, next) {
    try {
      const deleted = await EventModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Event not found" });
      res.json({ message: "Event deleted" });
    } catch (err) {
      next(err);
    }
  },

  async adminCount(req, res, next) {
    try {
      res.json({ count: await EventModel.count() });
    } catch (err) {
      next(err);
    }
  }
};

export const CategoryController = {
  async index(req, res, next) {
    try {
      res.json(await CategoryModel.findAll(req.query.featured === "true"));
    } catch (err) {
      next(err);
    }
  },

  async store(req, res, next) {
    try {
      const category = await CategoryModel.create(req.body);
      res.status(201).json(category);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const category = await CategoryModel.update(req.params.id, req.body);
      if (!category) return res.status(404).json({ error: "Category not found" });
      res.json(category);
    } catch (err) {
      next(err);
    }
  },

  async destroy(req, res, next) {
    try {
      const deleted = await CategoryModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Category not found" });
      res.json({ message: "Category deleted" });
    } catch (err) {
      next(err);
    }
  }
};