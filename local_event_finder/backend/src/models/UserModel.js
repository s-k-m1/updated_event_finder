import { query } from "../db.js";

export const UserModel = {
  async findByEmail(email) {
    const { rows } = await query("SELECT * FROM users WHERE email = $1", [email]);
    return rows[0];
  },

  async findById(id) {
    const { rows } = await query("SELECT * FROM users WHERE id = $1", [id]);
    return rows[0];
  },

  async create({ fullName, email, phone, passwordHash, role = "user" }) {
    const { rows } = await query(
      `INSERT INTO users (full_name, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, full_name, email, phone, role`,
      [fullName, email, phone || "", passwordHash, role]
    );
    return rows[0];
  },

  async findAll() {
    const { rows } = await query(
      `SELECT id, full_name, email, phone, role, created_at
       FROM users ORDER BY created_at DESC`
    );
    return rows;
  },

  async updateRole(id, role) {
    const { rows } = await query(
      `UPDATE users SET role = $1 WHERE id = $2 RETURNING id, full_name, email, phone, role`,
      [role, id]
    );
    return rows[0];
  },

  async update(id, { fullName, phone, role }) {
    const { rows } = await query(
      `UPDATE users SET full_name = $1, phone = $2, role = $3
       WHERE id = $4 RETURNING id, full_name, email, phone, role`,
      [fullName, phone || "", role, id]
    );
    return rows[0];
  },

  async delete(id) {
    const { rows } = await query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);
    return rows[0];
  },

  async count() {
    const { rows } = await query("SELECT COUNT(*)::int AS count FROM users");
    return rows[0].count;
  },

  async countAdmins() {
    const { rows } = await query("SELECT COUNT(*)::int AS count FROM users WHERE role = 'admin'");
    return rows[0].count;
  },

  async saveResetToken(email, token, expiresAt) {
    const { rows } = await query(
      `INSERT INTO password_resets (email, token, expires_at)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET token = $2, expires_at = $3, created_at = NOW()
       RETURNING email`,
      [email, token, expiresAt]
    );
    return rows[0];
  },

  async findByResetToken(token) {
    const { rows } = await query(
      `SELECT pr.email, pr.expires_at FROM password_resets pr WHERE pr.token = $1`,
      [token]
    );
    return rows[0];
  },

  async updatePassword(email, passwordHash) {
    const { rows } = await query(
      `UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id, email`,
      [passwordHash, email]
    );
    return rows[0];
  },

  async deleteResetToken(token) {
    await query("DELETE FROM password_resets WHERE token = $1", [token]);
  },

  async deleteExpiredResetTokens() {
    await query("DELETE FROM password_resets WHERE expires_at < NOW()");
  }
};