import pg from "pg";
import { config } from "./config.js";

const { Pool } = pg;

export const pool = new Pool(config.db);

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

export const query = (text, params) => pool.query(text, params);