import { query } from "../db.js";

const selectRegisteredEvent = `
    SELECT e.id, e.slug, e.title, e.rating, e.price, e.price_value,
           e.event_date AS date, e.event_time AS time, e.location, e.city,
           e.badge, e.image_url AS image, e.description, e.attendees,
           e.is_featured, e.is_trending, e.is_live, e.live_ago, e.organizer,
           c.name AS category, c.slug AS category_slug,
           r.payment_method AS "paymentMethod",
           r.payment_status AS "paymentStatus",
           r.created_at AS registered_at
    FROM registrations r
    JOIN events e ON e.id = r.event_id
    JOIN categories c ON c.id = e.category_id
  `;

export const RegistrationModel = {
  async findByUserId(userId) {
    const { rows } = await query(
      `${selectRegisteredEvent} WHERE r.user_id = $1 ORDER BY r.created_at DESC`,
      [userId]
    );
    return rows;
  },

  async findByPidx(pidx, userId) {
    if (userId !== undefined) {
      const { rows } = await query(
        "SELECT * FROM registrations WHERE khalti_pidx = $1 AND user_id = $2 LIMIT 1",
        [pidx, userId]
      );
      return rows[0] || null;
    }
    const { rows } = await query(
      "SELECT * FROM registrations WHERE khalti_pidx = $1 LIMIT 1",
      [pidx]
    );
    return rows[0] || null;
  },

  async isRegistered(userId, eventId) {
    const { rows } = await query(
      "SELECT 1 FROM registrations WHERE user_id = $1 AND event_id = $2",
      [userId, eventId]
    );
    return rows.length > 0;
  },

  async findByUserAndEvent(userId, eventId) {
    const { rows } = await query(
      "SELECT id, user_id, event_id, payment_method, payment_status, khalti_pidx FROM registrations WHERE user_id = $1 AND event_id = $2",
      [userId, eventId]
    );
    return rows[0] || null;
  },

  async add(userId, eventId) {
    const { rows } = await query(
      `INSERT INTO registrations (user_id, event_id, payment_status)
       VALUES ($1, $2, 'paid')
       ON CONFLICT (user_id, event_id) DO NOTHING
       RETURNING id`,
      [userId, eventId]
    );
    return rows[0] || null;
  },

  async addPending(userId, eventId, pidx) {
    const { rows } = await query(
      `INSERT INTO registrations (user_id, event_id, payment_method, payment_status, khalti_pidx)
       VALUES ($1, $2, 'khalti', 'pending', $3)
       ON CONFLICT (user_id, event_id)
       DO UPDATE SET khalti_pidx = EXCLUDED.khalti_pidx,
                     payment_method = 'khalti',
                     payment_status = 'pending'
       RETURNING id`,
      [userId, eventId, pidx]
    );
    return rows[0] || null;
  },

  async markPaid(pidx) {
    const { rows } = await query(
      `UPDATE registrations
       SET payment_status = 'paid', payment_method = 'khalti'
       WHERE khalti_pidx = $1
       RETURNING id, user_id, event_id`,
      [pidx]
    );
    return rows[0] || null;
  },

  async remove(userId, eventId) {
    await query(
      "DELETE FROM registrations WHERE user_id = $1 AND event_id = $2",
      [userId, eventId]
    );
    return true;
  },

  async count() {
    const { rows } = await query("SELECT COUNT(*)::int AS count FROM registrations");
    return rows[0].count;
  }
};
