import { query } from "../db.js";

export const SubscriberModel = {
  async subscribe(email) {
    const { rows } = await query(
      `INSERT INTO newsletter_subscribers (email) VALUES ($1)
       ON CONFLICT (email) DO NOTHING RETURNING *`,
      [email]
    );
    return rows[0];
  },

  async findAll() {
    const { rows } = await query("SELECT * FROM newsletter_subscribers ORDER BY created_at DESC");
    return rows;
  },

  async count() {
    const { rows } = await query("SELECT COUNT(*)::int AS count FROM newsletter_subscribers");
    return rows[0].count;
  }
};

export const ContentModel = {
  async get(key) {
    const { rows } = await query("SELECT value FROM site_content WHERE key = $1", [key]);
    return rows[0]?.value;
  },

  async set(key, value) {
    const { rows } = await query(
      `INSERT INTO site_content (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
       RETURNING *`,
      [key, JSON.stringify(value)]
    );
    return rows[0];
  },

  async findAll() {
    const { rows } = await query("SELECT key, value FROM site_content ORDER BY key");
    return rows;
  }
};