import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { query } from "../db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schema = fs.readFileSync(path.join(__dirname, "../sql/schema.sql"), "utf8");

async function run() {
  try {
    await query(schema);
    console.log("Database schema applied.");
  } catch (err) {
    console.error("Failed to apply schema:", err.message);
    process.exitCode = 1;
  }
}

run();