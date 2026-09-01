import nodemailer from "nodemailer";
import { config } from "../config.js";

const buildTransporter = () => {
  if (!config.smtp.host) return null;
  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: config.smtp.user ? { user: config.smtp.user, pass: config.smtp.pass } : undefined,
    tls: { rejectUnauthorized: false },
  });
};

let transporter = buildTransporter();

export const Mailer = {
  async send({ to, subject, html }) {
    if (!config.smtp.host || !transporter) {
      console.warn("SMTP_HOST not set — skipping email send to", to);
      return { skipped: true };
    }
    try {
      const info = await transporter.sendMail({
        from: config.smtp.from,
        to,
        subject,
        html,
      });
      console.log(`Email sent to ${to}: ${info.messageId}`);
      return info;
    } catch (err) {
      console.error(`Failed to send email to ${to}:`, err.message);
      throw err;
    }
  },

  async sendPasswordReset(email, resetUrl) {
    return this.send({
      to: email,
      subject: "Reset your LocalEvent Finder password",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #E2D7F3;border-radius:14px;background:#ffffff">
          <h2 style="color:#2B2238;margin:0 0 8px">Reset your password</h2>
          <p style="color:#6E6285;font-size:14px;line-height:1.6">
            We received a request to reset the password for your
            <strong>LocalEvent Finder</strong> account. Click the button below to
            choose a new password. This link expires in 30 minutes.
          </p>
          <div style="text-align:center;margin:24px 0">
            <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#8A6FC4,#5E4A94);color:#ffffff;text-decoration:none;font-weight:600;padding:12px 28px;border-radius:12px">
              Reset Password
            </a>
          </div>
          <p style="color:#9A8FB0;font-size:12px;line-height:1.6">
            If you didn't request this, you can safely ignore this email.
            <br/>Or copy this link into your browser:
            <br/><a href="${resetUrl}" style="color:#8A6FC4;word-break:break-all">${resetUrl}</a>
          </p>
        </div>
      `,
    });
  },

  async sendWelcome(email, fullName) {
    return this.send({
      to: email,
      subject: "Welcome to LocalEvent Finder!",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #E2D7F3;border-radius:14px;background:#ffffff">
          <h2 style="color:#2B2238;margin:0 0 8px">Welcome, ${fullName}! 🎉</h2>
          <p style="color:#6E6285;font-size:14px;line-height:1.6">
            Your <strong>LocalEvent Finder</strong> account has been created successfully.
            Explore events happening near you, register, and enjoy memorable experiences
            across Nepal.
          </p>
          <div style="text-align:center;margin:24px 0">
            <a href="${config.appUrl}/event" style="display:inline-block;background:linear-gradient(135deg,#8A6FC4,#5E4A94);color:#ffffff;text-decoration:none;font-weight:600;padding:12px 28px;border-radius:12px">
              Explore Events
            </a>
          </div>
        </div>
      `,
    });
  },

  async sendPaymentReceived(email, fullName, eventTitle, amount) {
    return this.send({
      to: email,
      subject: "Payment Received — Registration Confirmed",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #E2D7F3;border-radius:14px;background:#ffffff">
          <h2 style="color:#2B2238;margin:0 0 8px">Payment Received ✅</h2>
          <p style="color:#6E6285;font-size:14px;line-height:1.6">
            Hi ${fullName}, your payment of <strong>${amount}</strong> for
            <strong>"${eventTitle}"</strong> has been received successfully.
            You're confirmed to attend. See you there!
          </p>
        </div>
      `,
    });
  },

  async sendRegistrationConfirmed(email, fullName, eventTitle) {
    return this.send({
      to: email,
      subject: "Registration Confirmed — LocalEvent Finder",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #E2D7F3;border-radius:14px;background:#ffffff">
          <h2 style="color:#2B2238;margin:0 0 8px">Registration Confirmed ✅</h2>
          <p style="color:#6E6285;font-size:14px;line-height:1.6">
            Hi ${fullName}, you're registered for
            <strong>"${eventTitle}"</strong>. See you there!
          </p>
        </div>
      `,
    });
  },

  async sendPaymentDeclined(email, fullName, eventTitle) {
    return this.send({
      to: email,
      subject: "Payment Declined — LocalEvent Finder",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #F5D5D4;border-radius:14px;background:#ffffff">
          <h2 style="color:#B23B3B;margin:0 0 8px">Payment Declined</h2>
          <p style="color:#6E6285;font-size:14px;line-height:1.6">
            Hi ${fullName}, unfortunately your payment for
            <strong>"${eventTitle}"</strong> was declined. Please try again or
            contact support for assistance.
          </p>
        </div>
      `,
    });
  },
};