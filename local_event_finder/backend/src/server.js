import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { app } from "./app.js";
import { config } from "./config.js";
import { ensureDatabase, createAdminIfMissing } from "./scripts/bootstrapDb.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDist = path.resolve(
  __dirname,
  "../../frontend/local-event-finder/dist"
);
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get(/^\/(?!api\/).*/, (_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
  console.log(`Serving frontend build from ${frontendDist}`);
}

const started = (async () => {
  try {
    const { initialized } = await ensureDatabase();
    if (initialized) {
      const adminCreated = await createAdminIfMissing();
      console.log(
        adminCreated
          ? "Database initialized with seed data and default admin."
          : "Database initialized with seed data."
      );
    }
  } catch (err) {
    console.error("Database bootstrap failed:", err.message);
  }
})();

app.listen(config.port, async () => {
  await started;
  console.log(`Local Event Finder API running on http://localhost:${config.port}`);
});