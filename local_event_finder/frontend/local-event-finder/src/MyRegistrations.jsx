import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Star, ArrowRight, Ticket } from "lucide-react";
import { getRegistrations, unregisterEvent } from "./api";
import "./savedevents.css";

export default function MyRegistrations() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getRegistrations()
      .then(setEvents)
      .catch((err) => console.error("Failed to load registrations:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCancel = (slug) => {
    unregisterEvent(slug)
      .then(() => {
        setEvents((prev) => prev.filter((e) => e.slug !== slug));
        load();
      })
      .catch((err) => console.error("Failed to cancel registration:", err));
  };

  return (
    <section className="saved-section">
      <div className="saved-container">
        <div className="saved-title">
          <span></span>
          MY REGISTRATIONS
        </div>
        <h1>Your Registrations</h1>
        <p>Events you're registered for — see you there!</p>

        {loading ? (
          <p className="saved-empty">Loading...</p>
        ) : events.length === 0 ? (
          <div className="saved-empty">
            <Ticket size={40} />
            <p>No registrations yet.</p>
            <p>Register for an event to see it here.</p>
            <a className="saved-browse" href="/event">Browse Events</a>
          </div>
        ) : (
          <div className="saved-grid">
            {events.map((event) => (
              <div className="saved-card" key={event.id}>
                <div className="saved-image">
                  <img src={event.image} alt={event.title} />
                  {event.badge && <span className="badge">{event.badge}</span>}
                  <span className={`registered-chip ${event.paymentStatus === "pending" && Number(event.price_value) > 0 ? "pending" : ""}`}>
                    {Number(event.price_value) <= 0
                      ? "Registered"
                      : event.paymentStatus === "paid"
                      ? "Paid ✓"
                      : "Payment pending"}
                  </span>
                  <div className="image-bottom">
                    <span>{event.category}</span>
                    <span className="rating">
                      <Star />
                      {event.rating}
                    </span>
                    <strong>{event.price}</strong>
                  </div>
                </div>
                <div className="saved-card-body">
                  <h3>{event.title}</h3>
                  <p>
                    <Calendar />
                    {event.date}
                    <Clock />
                    {event.time}
                  </p>
                  <p>
                    <MapPin />
                    {event.location}
                  </p>
                  <div className="card-footer">
                    <b>{event.price}</b>
                    <span className="pay-method-chip">
                      {event.paymentMethod === "khalti" ? "Khalti" : event.paymentMethod ? "Paid" : "Free"}
                    </span>
                    <Link to={`/event/${event.slug}`} className="view-details-link">
                      View Details
                      <ArrowRight />
                    </Link>
                    <button className="cancel-btn" onClick={() => handleCancel(event.slug)}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}