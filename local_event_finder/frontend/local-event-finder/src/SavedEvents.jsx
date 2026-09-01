import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Calendar, Clock, MapPin, Star, ArrowRight, Trash2 } from "lucide-react";
import { getSavedEvents, unsaveEvent } from "./api";
import "./savedevents.css";

export default function SavedEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getSavedEvents()
      .then(setEvents)
      .catch((err) => console.error("Failed to load saved events:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleUnsave = (id) => {
    unsaveEvent(id)
      .then(() => setEvents((prev) => prev.filter((e) => e.id !== id)))
      .catch((err) => console.error("Failed to unsave:", err));
  };

  return (
    <section className="saved-section">
      <div className="saved-container">
        <div className="saved-title">
          <span></span>
          SAVED EVENTS
        </div>
        <h1>Your Saved Events</h1>
        <p>Events you've saved — we'll remind you when they're happening.</p>

        {loading ? (
          <p className="saved-empty">Loading...</p>
        ) : events.length === 0 ? (
          <div className="saved-empty">
            <Heart size={40} />
            <p>No saved events yet.</p>
            <p>Tap the heart on any event to save it here.</p>
            <a className="saved-browse" href="/event">Browse Events</a>
          </div>
        ) : (
          <div className="saved-grid">
            {events.map((event) => (
              <div className="saved-card" key={event.id}>
                <div className="saved-image">
                  <img src={event.image} alt={event.title} />
                  {event.badge && <span className="badge">{event.badge}</span>}
                  <button className="heart" onClick={() => handleUnsave(event.id)} title="Remove from saved">
                    <Trash2 />
                  </button>
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
                    <Link to={`/event/${event.slug}`} className="view-details-link">
                      View Details
                      <ArrowRight />
                    </Link>
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