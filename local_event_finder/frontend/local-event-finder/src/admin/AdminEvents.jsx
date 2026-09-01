import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import {
  getEvents,
  getCategories,
  adminCreateEvent,
  adminUpdateEvent,
  adminDeleteEvent,
} from "../api";
import Pagination from "./Pagination";

const PER_PAGE = 10;

const emptyForm = {
  title: "", slug: "", category_id: "", rating: "4.5", price: "Free", price_value: 0,
  event_date: "", event_time: "", location: "", city: "", badge: "", image_url: "",
  description: "", attendees: 0, is_featured: false, is_trending: false, is_live: false,
  live_ago: "", organizer: "", isFormOpen: false,
};

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);

  const load = () => {
    getEvents().then(setEvents).catch(console.error);
    getCategories().then(setCategories).catch(console.error);
    setPage(1);
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, category_id: "", isFormOpen: true });
  };

  const openEdit = (e) => {
    setEditing(e);
    setForm({
      title: e.title, slug: e.slug, category_id: e.category_slug || "",
      rating: e.rating, price: e.price, price_value: Number(e.price_value) || 0,
      event_date: e.date, event_time: e.time, location: e.location, city: e.city || "",
      badge: e.badge,
      image_url: e.image, description: e.description || "", attendees: e.attendees,
      is_featured: e.is_featured, is_trending: e.is_trending, is_live: e.is_live,
      live_ago: e.live_ago, organizer: e.organizer || "", isFormOpen: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cat = categories.find((c) => c.slug === form.category_id);
      if (!cat) {
        setMessage("Please select a category");
        return;
      }
      const payload = {
        ...form,
        category_id: cat.id,
        price_value: form.price === "Free" ? 0 : form.price_value,
      };
      if (editing) {
        await adminUpdateEvent(editing.id, payload);
        setMessage("Event updated successfully");
      } else {
        await adminCreateEvent(payload);
        setMessage("Event created successfully");
      }
      setEditing(null);
      setForm(emptyForm);
      load();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      await adminDeleteEvent(id);
      load();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const pageCount = Math.max(1, Math.ceil(events.length / PER_PAGE));
  const safePage = Math.min(page, pageCount);
  const paginatedEvents = events.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1 className="admin-page-title">Events</h1>
        <button className="admin-btn primary" onClick={openCreate}>
          <Plus size={16} /> New Event
        </button>
      </div>

      {message && <div className="admin-message">{message}</div>}

      {editing !== null || form.isFormOpen ? (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-head">
            <h2>{editing ? "Edit Event" : "Create Event"}</h2>
            <button type="button" className="admin-btn ghost" onClick={() => { setEditing(null); setForm(emptyForm); }}>
              <X size={16} /> Close
            </button>
          </div>

          <div className="admin-form-grid">
            <label>Title
              <input name="title" value={form.title} onChange={handleChange} required />
            </label>
            <label>Slug
              <input name="slug" value={form.slug} onChange={handleChange} required placeholder="event-slug" />
            </label>
            <label>Category
              <select name="category_id" value={form.category_id} onChange={handleChange} required>
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </label>
            <label>Rating
              <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handleChange} />
            </label>
            <label>Price (display)
              <input name="price" value={form.price} onChange={handleChange} placeholder="NPR 800 or Free" />
            </label>
            <label>Price value (NPR)
              <input name="price_value" type="number" value={form.price_value} onChange={handleChange} />
            </label>
            <label>Date
              <input name="event_date" value={form.event_date} onChange={handleChange} placeholder="Sat, 26 Jul 2025" />
            </label>
            <label>Time
              <input name="event_time" value={form.event_time} onChange={handleChange} placeholder="9:00 AM – 6:00 PM" />
            </label>
            <label>Location
              <input name="location" value={form.location} onChange={handleChange} />
            </label>
            <label>City
              <input name="city" value={form.city} onChange={handleChange} placeholder="kathmandu / pokhara / patan" />
            </label>
            <label>Badge
              <input name="badge" value={form.badge} onChange={handleChange} placeholder="Featured / Trending / (empty)" />
            </label>
            <label>Image URL
              <input name="image_url" value={form.image_url} onChange={handleChange} />
            </label>
            <label>Organizer
              <input name="organizer" value={form.organizer} onChange={handleChange} />
            </label>
          </div>

          <label>Description
            <textarea name="description" rows="3" value={form.description} onChange={handleChange} />
          </label>

          <div className="admin-checkboxes">
            <label><input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} /> Featured</label>
            <label><input type="checkbox" name="is_trending" checked={form.is_trending} onChange={handleChange} /> Trending</label>
            <label><input type="checkbox" name="is_live" checked={form.is_live} onChange={handleChange} /> Live</label>
            <label>Live ago
              <input name="live_ago" value={form.live_ago} onChange={handleChange} placeholder="2 mins ago" />
            </label>
            <label>Attendees
              <input name="attendees" type="number" value={form.attendees} onChange={handleChange} />
            </label>
          </div>

          <button className="admin-btn primary" type="submit">
            {editing ? "Update Event" : "Create Event"}
          </button>
        </form>
      ) : (
        <div className="admin-panel">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th><th>Category</th><th>Price</th><th>Date</th>
                <th>Featured</th><th>Trending</th><th>Live</th><th></th>
              </tr>
            </thead>
            <tbody>
              {paginatedEvents.map((e) => (
                <tr key={e.id}>
                  <td className="admin-event-title">
                    <img src={e.image} alt="" className="admin-thumb" onError={(ev) => (ev.target.style.display = "none")} />
                    {e.title}
                  </td>
                  <td>{e.category}</td>
                  <td>{e.price}</td>
                  <td>{e.date}</td>
                  <td>{e.is_featured ? "✓" : ""}</td>
                  <td>{e.is_trending ? "✓" : ""}</td>
                  <td>{e.is_live ? "✓" : ""}</td>
                  <td className="admin-row-actions">
                    <button className="admin-btn small" onClick={() => openEdit(e)}><Pencil size={14} /></button>
                    <button className="admin-btn small danger" onClick={() => handleDelete(e.id)}><Trash2 size={14} /></button>
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

export default AdminEvents;