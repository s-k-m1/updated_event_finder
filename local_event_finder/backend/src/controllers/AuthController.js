import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { config } from "../config.js";
import { UserModel } from "../models/UserModel.js";
import { Mailer } from "../services/mailer.js";

const signToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, config.jwtSecret, {
    expiresIn: "7d",
  });

const publicUser = (user) => ({
  id: user.id,
  fullName: user.full_name,
  email: user.email,
  phone: user.phone,
  role: user.role,
});

export const AuthController = {
  async register(req, res, next) {
    try {
      const { fullName, email, phone, password, role = "user" } = req.body;

      if (!fullName || !email || !password) {
        return res.status(400).json({ error: "Full name, email and password are required" });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }

      const existing = await UserModel.findByEmail(email);
      if (existing) {
        return res.status(409).json({ error: "An account with this email already exists" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await UserModel.create({ fullName, email, phone, passwordHash, role });

      try {
        await Mailer.sendWelcome(email, fullName);
      } catch (err) {
        console.error("Failed to send welcome email:", err.message);
      }

      res.status(201).json({ user: publicUser(user), token: signToken(user) });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const user = await UserModel.findByEmail(email);
      if (!user) return res.status(401).json({ error: "Invalid email or password" });

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) return res.status(401).json({ error: "Invalid email or password" });

      res.json({ user: publicUser(user), token: signToken(user) });
    } catch (err) {
      next(err);
    }
  },

  async me(req, res, next) {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) return res.status(401).json({ error: "User not found" });
      res.json(publicUser(user));
    } catch (err) {
      next(err);
    }
  },

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: "Email is required" });

      const user = await UserModel.findByEmail(email);
      if (!user) return res.status(404).json({ error: "No account found with this email" });

      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
      await UserModel.saveResetToken(email, token, expiresAt);

      const resetUrl = `${config.appUrl}/reset-password?token=${token}`;
      try {
        await Mailer.sendPasswordReset(email, resetUrl);
      } catch (err) {
        console.error("Failed to send reset email:", err.message);
        return res.status(502).json({ error: "Failed to send email. Check SMTP settings." });
      }

      res.json({ message: "Password reset link sent to your email" });
    } catch (err) {
      next(err);
    }
  },

  async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;
      if (!token || !password) {
        return res.status(400).json({ error: "Token and new password are required" });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }

      const record = await UserModel.findByResetToken(token);
      if (!record) return res.status(400).json({ error: "Invalid or expired reset link" });
      if (new Date(record.expires_at) < new Date()) {
        await UserModel.deleteResetToken(token);
        return res.status(400).json({ error: "Reset link has expired. Please request a new one." });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      await UserModel.updatePassword(record.email, passwordHash);
      await UserModel.deleteResetToken(token);
      await UserModel.deleteExpiredResetTokens();

      res.json({ message: "Password updated successfully. You can now log in." });
    } catch (err) {
      next(err);
    }
  }
};