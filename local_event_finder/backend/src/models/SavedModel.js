import { query } from "../db.js";

export const selectSavedEvent = `
    SELECT e.id, e.slug, e.title, e.rating, e.price, e.price_value,
           e.event_date AS date, e.event_time AS time, e.location, e.city,
           e.badge, e.image_url AS image, e.description, e.attendees,
           e.is_featured, e.is_trending, e.is_live, e.live_ago, e.organizer,
           c.name AS category, c.slug AS category_slug,
           se.created_at AS saved_at
    FROM saved_events se
    JOIN events e ON e.id = se.event_id
    JOIN categories c ON c.id = e.category_id
  `;

export const SavedModel = {
  async findByUserId(userId) {
    const { rows } = await query(
      `${selectSavedEvent} WHERE se.user_id = $1 ORDER BY se.created_at DESC`,
      [userId]
    );
    return rows;
  },

  async findIdsByUserId(userId) {
    const { rows } = await query(
      "SELECT event_id FROM saved_events WHERE user_id = $1",
      [userId]
    );
    return rows.map((r) => r.event_id);
  },

  async isSaved(userId, eventId) {
    const { rows } = await query(
      "SELECT 1 FROM saved_events WHERE user_id = $1 AND event_id = $2",
      [userId, eventId]
    );
    return rows.length > 0;
  },

  async add(userId, eventId) {
    await query(
      `INSERT INTO saved_events (user_id, event_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, event_id) DO NOTHING`,
      [userId, eventId]
    );
    return true;
  },

  async remove(userId, eventId) {
    await query(
      "DELETE FROM saved_events WHERE user_id = $1 AND event_id = $2",
      [userId, eventId]
    );
    return true;
  },

  async count(userId) {
    const { rows } = await query(
      "SELECT COUNT(*)::int AS count FROM saved_events WHERE user_id = $1",
      [userId]
    );
    return rows[0].count;
  }
};