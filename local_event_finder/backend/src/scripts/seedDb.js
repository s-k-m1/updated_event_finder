import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "../db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  const client = await pool.connect();
  try {
    const seed = fs.readFileSync(path.join(__dirname, "../sql/seed.sql"), "utf8");
    await client.query("TRUNCATE users, categories, events, site_content RESTART IDENTITY CASCADE");
    await client.query(seed);
    console.log("Database seeded.");
  } catch (err) {
    console.error("Failed to seed database:", err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

run();