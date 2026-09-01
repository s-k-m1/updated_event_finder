import { query } from "../db.js";

export const CategoryModel = {
  async findAll(featured = false) {
    let sql = `SELECT c.id, c.name, c.slug, c.icon_name AS "iconName", c.bg_color AS "bgColor",
                      COUNT(e.id)::int AS "eventCount", c.description, c.image_url AS "imageUrl",
                      c.is_featured AS "isFeatured", c.sort_order AS "sortOrder"
               FROM categories c
               LEFT JOIN events e ON e.category_id = c.id`;
    if (featured) sql += ` WHERE c.is_featured = TRUE`;
    sql += ` GROUP BY c.id ORDER BY c.sort_order ASC`;
    const { rows } = await query(sql);
    return rows;
  },

  async findById(id) {
    const { rows } = await query("SELECT * FROM categories WHERE id = $1", [id]);
    return rows[0];
  },

  async findBySlug(slug) {
    const { rows } = await query("SELECT * FROM categories WHERE slug = $1", [slug]);
    return rows[0];
  },

  async create(data) {
    const { rows } = await query(
      `INSERT INTO categories (name, slug, icon_name, bg_color, event_count, description, image_url, is_featured, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [data.name, data.slug, data.icon_name, data.bg_color, data.event_count, data.description, data.image_url, data.is_featured, data.sort_order]
    );
    return rows[0];
  },

  async update(id, data) {
    const { rows } = await query(
      `UPDATE categories SET
         name = $1, slug = $2, icon_name = $3, bg_color = $4, event_count = $5,
         description = $6, image_url = $7, is_featured = $8, sort_order = $9
       WHERE id = $10 RETURNING *`,
      [data.name, data.slug, data.icon_name, data.bg_color, data.event_count, data.description, data.image_url, data.is_featured, data.sort_order, id]
    );
    return rows[0];
  },

  async delete(id) {
    const { rows } = await query("DELETE FROM categories WHERE id = $1 RETURNING id", [id]);
    return rows[0];
  },

  async count() {
    const { rows } = await query("SELECT COUNT(*)::int AS count FROM categories");
    return rows[0].count;
  }
};
