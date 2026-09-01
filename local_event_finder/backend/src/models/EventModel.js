import { query } from "../db.js";

function parseEventDates(dateStr) {
  const m = dateStr.match(/(\d{1,2})(?:\s*[-\u2013\u2014]\s*(\d{1,2}))?\s+([A-Za-z]{3})\s+(\d{4})/);
  if (!m) return [];
  const months = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  const month = months[m[3]];
  if (month === undefined) return [];
  const start = parseInt(m[1], 10);
  const end = m[2] ? parseInt(m[2], 10) : start;
  const year = parseInt(m[4], 10);
  const dates = [];
  for (let d = start; d <= end && d <= 31; d++) dates.push(new Date(year, month, d));
  return dates;
}

export function matchesDateFilter(dateStr, filter) {
  const dates = parseEventDates(dateStr);
  if (!dates.length) return false;
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return dates.some((d) => {
    if (filter === "today") {
      return d.getTime() === startOfToday.getTime();
    }
    if (filter === "tomorrow") {
      return Math.round((d - startOfToday) / 86400000) === 1;
    }
    if (filter === "week") {
      const diff = (d - startOfToday) / 86400000;
      return diff >= 0 && diff <= 7;
    }
    if (filter === "weekend") {
      const diff = (d - startOfToday) / 86400000;
      const day = d.getDay();
      return (day === 0 || day === 6) && diff >= 0 && diff <= 7;
    }
    if (filter === "month") {
      return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth();
    }
    return true;
  });
}

export const EventModel = {
  selectEvent: `
    SELECT e.id, e.slug, e.title, e.rating, e.price, e.price_value,
           e.event_date AS date, e.event_time AS time, e.location, e.city,
           e.lat, e.lng,
           e.badge, e.image_url AS image, e.description, e.attendees,
           e.is_featured, e.is_trending, e.is_live, e.live_ago, e.organizer,
           c.name AS category, c.slug AS category_slug
    FROM events e
    JOIN categories c ON c.id = e.category_id
  `,

  async findAll(filters = {}) {
    const { category, search, price, sort, location, date } = filters;
    const conditions = [];
    const params = [];

    if (category) {
      params.push(category);
      conditions.push(`c.slug = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(e.title ILIKE $${params.length} OR e.location ILIKE $${params.length} OR c.name ILIKE $${params.length} OR e.description ILIKE $${params.length})`);
    }

    if (location) {
      params.push(`%${location}%`);
      conditions.push(`e.city ILIKE $${params.length}`);
    }

    if (price === "free") conditions.push("e.price_value = 0");
    else if (price === "paid") conditions.push("e.price_value > 0");

    let orderBy = "e.id ASC";
    if (sort === "popular") orderBy = "e.attendees DESC, e.rating DESC";
    else if (sort === "price_asc") orderBy = "e.price_value ASC";
    else if (sort === "rating") orderBy = "e.rating DESC";

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const { rows } = await query(`${this.selectEvent} ${where} ORDER BY ${orderBy}`, params);

    if (date && ["today", "tomorrow", "week", "weekend", "month"].includes(date)) {
      return rows.filter((r) => matchesDateFilter(r.date, date));
    }
    return rows;
  },

  async findFeatured() {
    const { rows } = await query(`${this.selectEvent} WHERE e.is_featured = TRUE ORDER BY e.id ASC`);
    return rows;
  },

  async findTrending() {
    const { rows } = await query(`${this.selectEvent} WHERE e.is_trending = TRUE ORDER BY e.id ASC`);
    return rows;
  },

  async findLive() {
    const { rows } = await query(`${this.selectEvent} WHERE e.is_live = TRUE ORDER BY e.attendees DESC`);
    return rows;
  },

  async findBySlug(slug) {
    const { rows } = await query(`${this.selectEvent} WHERE e.slug = $1`, [slug]);
    return rows[0];
  },

  async findById(id) {
    const { rows } = await query(`${this.selectEvent} WHERE e.id = $1`, [id]);
    return rows[0];
  },

  async findNearby(lat, lng, radiusKm = 30) {
    const { rows } = await query(
      `SELECT e.id, e.slug, e.title, e.rating, e.price, e.price_value,
              e.event_date AS date, e.event_time AS time, e.location, e.city,
              e.lat, e.lng, e.badge, e.image_url AS image, e.description, e.attendees,
              e.is_featured, e.is_trending, e.is_live, e.live_ago, e.organizer,
              c.name AS category, c.slug AS category_slug,
              (6371 * acos(LEAST(1, cos(radians($1)) * cos(radians(e.lat)) *
               cos(radians(e.lng) - radians($2)) + sin(radians($1)) * sin(radians(e.lat)))))::int AS distance_km
       FROM events e
       JOIN categories c ON c.id = e.category_id
       WHERE e.lat IS NOT NULL AND e.lng IS NOT NULL
         AND (6371 * acos(LEAST(1, cos(radians($1)) * cos(radians(e.lat)) *
              cos(radians(e.lng) - radians($2)) + sin(radians($1)) * sin(radians(e.lat))))) <= $3
       ORDER BY distance_km ASC
       LIMIT 20`,
      [lat, lng, radiusKm]
    );
    return rows;
  },

  async create(data) {
    const { rows } = await query(
      `INSERT INTO events (slug, title, category_id, rating, price, price_value,
         event_date, event_time, location, city, lat, lng, badge, image_url, description, attendees,
         is_featured, is_trending, is_live, live_ago, organizer)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
       RETURNING *`,
      [
        data.slug, data.title, data.category_id, data.rating, data.price, data.price_value,
        data.event_date, data.event_time, data.location, data.city || "", data.lat ?? null,
        data.lng ?? null, data.badge || "", data.image_url || "", data.description, data.attendees || 0,
        data.is_featured || false, data.is_trending || false, data.is_live || false,
        data.live_ago || "", data.organizer || ""
      ]
    );
    return rows[0];
  },

  async update(id, data) {
    const { rows } = await query(
      `UPDATE events SET
         slug = $1, title = $2, category_id = $3, rating = $4, price = $5,
         price_value = $6, event_date = $7, event_time = $8, location = $9,
         city = $10, lat = $11, lng = $12, badge = $13, image_url = $14, description = $15, attendees = $16,
         is_featured = $17, is_trending = $18, is_live = $19, live_ago = $20, organizer = $21
       WHERE id = $22 RETURNING *`,
      [
        data.slug, data.title, data.category_id, data.rating, data.price, data.price_value,
        data.event_date, data.event_time, data.location, data.city || "", data.lat ?? null,
        data.lng ?? null, data.badge, data.image_url, data.description, data.attendees,
        data.is_featured, data.is_trending, data.is_live, data.live_ago, data.organizer, id
      ]
    );
    return rows[0];
  },

  async delete(id) {
    const { rows } = await query("DELETE FROM events WHERE id = $1 RETURNING id", [id]);
    return rows[0];
  },

  async count() {
    const { rows } = await query("SELECT COUNT(*)::int AS count FROM events");
    return rows[0].count;
  }
};