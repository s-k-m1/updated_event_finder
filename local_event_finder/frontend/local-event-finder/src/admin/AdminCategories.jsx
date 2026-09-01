import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import {
  getCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
} from "../api";
import Pagination from "./Pagination";

const PER_PAGE = 10;

const emptyForm = { name: "", slug: "", icon_name: "", bg_color: "#E6DDF4", event_count: 0, description: "", image_url: "", is_featured: false, sort_order: 0, isFormOpen: false };

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);

  const load = () => { getCategories().then(setCategories).catch(console.error); setPage(1); };
  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value }));
  };

  const openCreate = () => { setEditing(null); setForm({ ...emptyForm, isFormOpen: true }); };
  const openEdit = (c) => {
    setEditing(c);
    setForm({
      name: c.name, slug: c.slug, icon_name: c.iconName, bg_color: c.bgColor,
      event_count: c.eventCount, description: c.description || "", image_url: c.imageUrl || "",
      is_featured: c.isFeatured, sort_order: c.sortOrder, isFormOpen: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await adminUpdateCategory(editing.id, form);
      else await adminCreateCategory(form);
      setMessage(editing ? "Category updated" : "Category created");
      setEditing(null);
      setForm(emptyForm);
      load();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category and its events?")) return;
    try {
      await adminDeleteCategory(id);
      load();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const pageCount = Math.max(1, Math.ceil(categories.length / PER_PAGE));
  const safePage = Math.min(page, pageCount);
  const paginatedCategories = categories.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1 className="admin-page-title">Categories</h1>
        <button className="admin-btn primary" onClick={openCreate}><Plus size={16} /> New Category</button>
      </div>

      {message && <div className="admin-message">{message}</div>}

      {form.isFormOpen ? (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-head">
            <h2>{editing ? "Edit Category" : "Create Category"}</h2>
            <button type="button" className="admin-btn ghost" onClick={() => { setEditing(null); setForm(emptyForm); }}>
              <X size={16} /> Close
            </button>
          </div>
          <div className="admin-form-grid">
            <label>Name <input name="name" value={form.name} onChange={handleChange} required /></label>
            <label>Slug <input name="slug" value={form.slug} onChange={handleChange} required /></label>
            <label>Icon name <input name="icon_name" value={form.icon_name} onChange={handleChange} placeholder="Music / Laptop / Trophy..." /></label>
            <label>Background color <input name="bg_color" type="color" value={form.bg_color} onChange={handleChange} /></label>
            <label>Event count <input name="event_count" type="number" value={form.event_count} onChange={handleChange} /></label>
            <label>Sort order <input name="sort_order" type="number" value={form.sort_order} onChange={handleChange} /></label>
            <label>Image URL <input name="image_url" value={form.image_url} onChange={handleChange} /></label>
            <label className="admin-checkbox-inline">
              <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} /> Featured
            </label>
          </div>
          <label>Description
            <textarea name="description" rows="2" value={form.description} onChange={handleChange} />
          </label>
          <button className="admin-btn primary" type="submit">{editing ? "Update Category" : "Create Category"}</button>
        </form>
      ) : (
        <div className="admin-panel">
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Slug</th><th>Icon</th><th>Events</th><th>Featured</th><th>Color</th><th></th></tr>
            </thead>
            <tbody>
              {paginatedCategories.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.slug}</td>
                  <td>{c.iconName}</td>
                  <td>{c.eventCount}</td>
                  <td>{c.isFeatured ? "✓" : ""}</td>
                  <td><span className="admin-color-swatch" style={{ background: c.bgColor }} /></td>
                  <td className="admin-row-actions">
                    <button className="admin-btn small" onClick={() => openEdit(c)}><Pencil size={14} /></button>
                    <button className="admin-btn small danger" onClick={() => handleDelete(c.id)}><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
};

export default AdminCategories;