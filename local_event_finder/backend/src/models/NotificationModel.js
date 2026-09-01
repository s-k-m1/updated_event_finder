import { query } from "../db.js";

export const NotificationModel = {
  async findByUserId(userId, limit = 10) {
    const { rows } = await query(
      `SELECT id, title, message, is_read AS "isRead", created_at AS "createdAt"
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [userId, limit]
    );
    return rows;
  },

  async create(userId, title, message) {
    const { rows } = await query(
      `INSERT INTO notifications (user_id, title, message)
       VALUES ($1, $2, $3) RETURNING id`,
      [userId, title, message]
    );
    return rows[0];
  },

  async markAllRead(userId) {
    await query(
      "UPDATE notifications SET is_read = TRUE WHERE user_id = $1",
      [userId]
    );
    return true;
  },

  async markRead(userId, id) {
    await query(
      "UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND id = $2",
      [userId, id]
    );
    return true;
  },

  async unreadCount(userId) {
    const { rows } = await query(
      "SELECT COUNT(*)::int AS count FROM notifications WHERE user_id = $1 AND is_read = FALSE",
      [userId]
    );
    return rows[0].count;
  },

  async findAll(limit = 50) {
    const { rows } = await query(
      `SELECT n.id, n.title, n.message, n.is_read AS "isRead", n.created_at AS "createdAt",
              n.user_id AS "userId", u.full_name AS "userName"
       FROM notifications n
       LEFT JOIN users u ON u.id = n.user_id
       ORDER BY n.created_at DESC
       LIMIT $1`,
      [limit]
    );
    return rows;
  },

  async createForAll(title, message) {
    const { rows } = await query(
      `INSERT INTO notifications (user_id, title, message)
       SELECT id, $1, $2 FROM users
       RETURNING id`,
      [title, message]
    );
    return rows.length;
  }
};