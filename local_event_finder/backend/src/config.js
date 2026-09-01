import "dotenv/config";

export const config = {
  port: process.env.PORT || 5000,
  db: process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.PGHOST || "127.0.0.1",
        port: Number(process.env.PGPORT) || 5433,
        database: process.env.PGDATABASE || "event_finder",
        user: process.env.PGUSER || "eventfinder",
        password: process.env.PGPASSWORD || ""
      },
  jwtSecret: process.env.JWT_SECRET || "local-event-finder-dev-secret",

  khaltiPublicKey: process.env.KHALTI_PUBLIC_KEY || "",
  khaltiSecretKey: process.env.KHALTI_SECRET_KEY || "",
  khaltiSandbox: process.env.KHALTI_SANDBOX !== "false",
  khaltiDemo: process.env.KHALTI_DEMO === "true",

  appUrl: process.env.APP_URL || "http://localhost:5173",

  smtp: {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@example.com"
  }
};