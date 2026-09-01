import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Ticket, Heart, Bell, CalendarDays, Clock, MapPin, Star, ArrowRight } from "lucide-react";
import Navigation from "./home/navigationbar.jsx";
import Footer from "./home/Footer.jsx";
import { useAuth } from "./context/AuthContext";
import { getRegistrations, getSavedEvents, getNotifications } from "./api";
import "./userdashboard.css";

export default function UserDashboard() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [saved, setSaved] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      getRegistrations(),
      getSavedEvents(),
      getNotifications(),
    ]).then(([reg, sav, notif]) => {
      if (reg.status === "fulfilled") setRegistrations(reg.value);
      if (sav.status === "fulfilled") setSaved(sav.value);
      if (notif.status === "fulfilled") setUnread(notif.value.unreadCount || 0);
    }).finally(() => setLoading(false));
  }, []);

  if (user.role === "admin") return <Navigate to="/admin" replace />;

  const firstName = user?.fullName?.split(" ")[0] || "there";

  const cards = [
    { label: "My Registrations", value: registrations.length, icon: Ticket, to: "/registrations", color: "#8A6FC4" },
    { label: "Saved Events", value: saved.length, icon: Heart, to: "/saved", color: "#C0457B" },
    { label: "Unread Notifications", value: unread, icon: Bell, to: "#", color: "#E0863B" },
  ];

  return (
    <>
      <Navigation />
      <section className="udash-section">
        <div className="udash-container">

          <div className="udash-hero">
            <div className="udash-hero-text">
              <span className="udash-label">USER DASHBOARD</span>
              <h1>Welcome back, {firstName}! 👋</h1>
              <p>
                Manage your events, registrations and saved favourites — all in one place.
              </p>
            </div>
            <div className="udash-avatar">
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>

          {loading ? (
            <p className="udash-empty">Loading your dashboard...</p>
          ) : (
            <>
              <div className="udash-cards">
                {cards.map(({ label, value, icon: Icon, to, color }) => (
                  <Link to={to} key={label} className="udash-card" style={{ borderTop: `3px solid ${color}` }}>
                    <div className="udash-card-icon" style={{ background: color + "22", color }}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <div className="udash-card-value">{value}</div>
                      <div className="udash-card-label">{label}</div>
                    </div>
                    <ArrowRight className="udash-card-arrow" size={16} />
                  </Link>
                ))}
              </div>

              <div className="udash-cols">
                <div className="udash-panel">
                  <div className="udash-panel-head">
                    <h3>Your Upcoming Registrations</h3>
                    <Link to="/registrations" className="udash-viewall">View all</Link>
                  </div>
                  {registrations.length === 0 ? (
                    <div className="udash-empty">
                      <Ticket size={32} />
                      <p>No registrations yet.</p>
                      <Link to="/event" className="udash-browse">Browse Events →</Link>
                    </div>
                  ) : (
                    <div className="udash-eventlist">
                      {registrations.slice(0, 3).map((e) => (
                        <Link to={`/event/${e.slug}`} key={e.id} className="udash-event">
                          <img src={e.image} alt={e.title} />
                          <div>
                            <strong>{e.title}</strong>
                            <span><CalendarDays size={12} /> {e.date} · <Clock size={12} /> {e.time}</span>
                            <em className={e.paymentStatus === "paid" ? "paid" : "pending"}>
                              {Number(e.price_value) <= 0 ? "Registered ✓" : e.paymentStatus === "paid" ? "Paid ✓" : "Payment pending"}
                            </em>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className="udash-panel">
                  <div className="udash-panel-head">
                    <h3>Your Saved Events</h3>
                    <Link to="/saved" className="udash-viewall">View all</Link>
                  </div>
                  {saved.length === 0 ? (
                    <div className="udash-empty">
                      <Heart size={32} />
                      <p>No saved events yet.</p>
                      <Link to="/event" className="udash-browse">Browse Events →</Link>
                    </div>
                  ) : (
                    <div className="udash-eventlist">
                      {saved.slice(0, 3).map((e) => (
                        <Link to={`/event/${e.slug}`} key={e.id} className="udash-event">
                          <img src={e.image} alt={e.title} />
                          <div>
                            <strong>{e.title}</strong>
                            <span><MapPin size={12} /> {e.location}</span>
                            <em><Star size={11} /> {e.rating}</em>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

        </div>
      </section>
      <Footer />
    </>
  );
}
