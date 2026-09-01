import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Star, Calendar, Clock, MapPin } from "lucide-react";
import { getEvents, getFeaturedEvents, getSavedIds, saveEvent, unsaveEvent } from "../api";
import { useAuth } from "../context/AuthContext";
import "./featuredevent.css";

const tabs = ["All", "This Week", "Free", "Music", "Tech", "Culture"];

export default function FeaturedEvents() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("All");
  const [saved, setSaved] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!user) { setSaved([]); return; }
    getSavedIds()
      .then((d) => setSaved(d.ids))
      .catch((err) => console.error("Failed to load saved ids:", err));
  }, [user]);

  const loadEvents = (tab) => {
    let params = "";
    if (tab === "Free") params = "?price=free";
    else if (tab === "Music" || tab === "Tech" || tab === "Culture") params = `?category=${tab.toLowerCase()}`;
    else if (tab === "This Week") params = "?date=week";

    const fetcher =
      tab === "All" || tab === "This Week"
        ? () => getFeaturedEvents(params)
        : () => getEvents(params);

    fetcher()
      .then(setEvents)
      .catch((err) => console.error("Failed to load featured events:", err));
  };

  useEffect(() => {
    loadEvents(activeTab);
  }, [activeTab]);

  const selectTab = (tab) => setActiveTab(tab);

  const toggleSave = (id) => {
    if (!user) return;
    const isSaved = saved.includes(id);
    setSaved(isSaved ? saved.filter(item => item !== id) : [...saved, id]);
    const action = isSaved ? unsaveEvent : saveEvent;
    action(id).catch((err) => {
      console.error("Failed to toggle save:", err);
      setSaved(isSaved ? [...saved, id] : saved.filter(item => item !== id));
    });
  };

  return (
    <section className="featured-section">
      <div className="featured-container">

        <div className="featured-header">
          <div>
            <div className="featured-label">
              <span></span>
              DON'T MISS OUT
            </div>

            <h2>Featured Events</h2>
          </div>

          <Link to="/event" className="view-all">
            View All
            <ArrowRight />
          </Link>
        </div>

        <div className="event-tabs">
          {tabs.map(tab => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => selectTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="event-grid">
          {events.map(event => (
            <div className="event-card" key={event.id}>

              <div className="event-image">
                <img src={event.image} alt={event.title} />

                <div className="image-overlay"></div>

                {event.badge && (
                  <span className="event-badge">
                    {event.badge}
                  </span>
                )}

                <button
                  className="heart-btn"
                  onClick={() => toggleSave(event.id)}
                >
                  <Heart className={saved.includes(event.id) ? "saved" : ""} />
                </button>

                <div className="image-details">
                  <span>{event.category}</span>

                  <span className="rating">
                    <Star />
                    {event.rating}
                  </span>

                  <span className="event-price">
                    {event.price}
                  </span>
                </div>
              </div>

              <div className="event-content">

                <h3>{event.title}</h3>

                <div className="event-info">
                  <Calendar />
                  {event.date}
                  <Clock />
                  {event.time}
                </div>

                <div className="event-info">
                  <MapPin />
                  {event.location}
                </div>

                <div className="event-footer">
                  <strong>{event.price}</strong>

                  <Link to={`/event/${event.slug}`} className="view-details">
                    View Details
                    <ArrowRight />
                  </Link>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}