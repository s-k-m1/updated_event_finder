import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories, adminCreateEvent, getMe } from "./api";
import "./CreateEvent.css";

const emptyForm = {
  title: "", slug: "", category_id: "", rating: "4.5", price: "Free", price_value: 0,
  event_date: "", event_time: "", location: "", city: "", badge: "", image_url: "",
  description: "", attendees: 0, organizer: "",
};

export default function CreateEvent() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
    getMe().then((u) => setForm((f) => ({ ...f, organizer: u.fullName }))).catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const cat = categories.find((c) => c.slug === form.category_id);
      if (!cat) {
        setMessage("Please select a category");
        return;
      }
      const payload = {
        ...form,
        category_id: cat.id,
        slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        price_value: form.price === "Free" ? 0 : form.price_value,
      };
      const created = await adminCreateEvent(payload);
      setSuccess(true);
      setMessage("");
      setTimeout(() => navigate(`/event/${created.slug}`), 1200);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <section className="create-section">
      <div className="create-container">
        <div className="saved-title">
          <span></span>
          CREATE EVENT
        </div>
        <h1>Create Your Event</h1>
        <p>Fill in the details below — your event will appear on the site right away.</p>

        {success ? (
          <div className="saved-empty">
            <p>Your event has been created! Redirecting to its page...</p>
          </div>
        ) : (
          <form className="create-form" onSubmit={handleSubmit}>
            <div className="create-grid">
              <label>Event title
                <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Pokhara Jazz Night" required />
              </label>
              <label>Slug (optional, auto-generated)
                <input name="slug" value={form.slug} onChange={handleChange} placeholder="pokhara-jazz-night" />
              </label>
              <label>Category
                <select name="category_id" value={form.category_id} onChange={handleChange} required>
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </label>
              <label>Badge (optional)
                <input name="badge" value={form.badge} onChange={handleChange} placeholder="e.g. Free entry" />
              </label>
              <label>Date
                <input name="event_date" value={form.event_date} onChange={handleChange} placeholder="Sat, 7 Aug 2026" required />
              </label>
              <label>Time
                <input name="event_time" value={form.event_time} onChange={handleChange} placeholder="6:00 PM" required />
              </label>
              <label>Location
                <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Patan Durbar Square" required />
              </label>
              <label>City
                <input name="city" value={form.city} onChange={handleChange} placeholder="e.g. kathmandu" />
              </label>
              <label>Price
                <select name="price" value={form.price} onChange={handleChange}>
                  <option value="Free">Free</option>
                  <option value="$5">$5</option>
                  <option value="$10">$10</option>
                  <option value="$15">$15</option>
                  <option value="$20">$20</option>
                  <option value="$25">$25</option>
                  <option value="$30">$30</option>
                </select>
              </label>
              <label>Price value (number)
                <input type="number" name="price_value" value={form.price_value} onChange={handleChange} />
              </label>
              <label>Image URL
                <input name="image_url" value={form.image_url} onChange={handleChange} placeholder="https://..." />
              </label>
              <label>Attendees (approx.)
                <input type="number" name="attendees" value={form.attendees} onChange={handleChange} />
              </label>
            </div>
            <label>Description
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Tell people about your event..." required />
            </label>
            <label>Organizer
              <input name="organizer" value={form.organizer} onChange={handleChange} placeholder="Your name or organization" />
            </label>
            {message && <div className="create-error">{message}</div>}
            <button type="submit" className="create-submit">Submit Event</button>
          </form>
        )}
      </div>
    </section>
  );
}