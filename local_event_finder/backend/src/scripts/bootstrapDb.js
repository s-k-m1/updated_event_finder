import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool, query } from "../db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function ensureDatabase() {
  const { rows } = await query(
    "SELECT 1 FROM information_schema.tables WHERE table_name = 'events'"
  );
  if (rows.length > 0) return { initialized: false };

  const schema = fs.readFileSync(path.join(__dirname, "../sql/schema.sql"), "utf8");
  await query(schema);

  const hasSeed = fs.existsSync(path.join(__dirname, "../sql/seed.sql"));
  if (hasSeed) {
    const seed = fs.readFileSync(path.join(__dirname, "../sql/seed.sql"), "utf8");
    await query(seed);
  }
  return { initialized: true };
}

export async function createAdminIfMissing() {
  const { rows } = await query("SELECT COUNT(*)::int AS count FROM users WHERE role = 'admin'");
  if (rows[0].count > 0) return false;
  const bcrypt = (await import("bcryptjs")).default;
  const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 10);
  await query(
    `INSERT INTO users (full_name, email, phone, password_hash, role)
     VALUES ('Admin', 'admin@eventfinder.com', '+977 9800000000', $1, 'admin')
     ON CONFLICT (email) DO NOTHING`,
    [hash]
  );
  return true;
}

export { pool };
