import React, { useState, useEffect } from "react";
import { Bell, CheckCheck } from "lucide-react";
import Navigation from "./home/navigationbar.jsx";
import Footer from "./home/Footer.jsx";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "./api";
import "./userdashboard.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    load();
  }, []);

  const load = () => {
    setLoading(true);
    getNotifications()
      .then((d) => {
        setNotifications(d.notifications || []);
        setUnread(d.unreadCount || 0);
      })
      .catch((err) => console.error("Failed to load notifications:", err))
      .finally(() => setLoading(false));
  };

  const timeAgo = (ts) => {
    const diff = Math.max(1, Math.floor((Date.now() - new Date(ts).getTime()) / 60000));
    if (diff < 60) return `${diff} minute${diff > 1 ? "s" : ""} ago`;
    const h = Math.floor(diff / 60);
    if (h < 24) return `${h} hour${h > 1 ? "s" : ""} ago`;
    return `${Math.floor(h / 24)} day${Math.floor(h / 24) > 1 ? "s" : ""} ago`;
  };

  const handleRead = (n) => {
    if (n.isRead) return;
    markNotificationRead(n.id)
      .then(() => {
        setUnread((u) => Math.max(0, u - 1));
        setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)));
      })
      .catch(() => {});
  };

  const handleMarkAll = () => {
    if (unread === 0) return;
    markAllNotificationsRead()
      .then(() => {
        setUnread(0);
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      })
      .catch(() => {});
  };

  return (
    <>
      <Navigation />
      <section className="udash-section">
        <div className="udash-container">
        <div className="udash-hero">
          <div className="udash-hero-text">
            <span className="udash-label">NOTIFICATIONS</span>
            <h1>Your Notifications</h1>
            <p>Payment and registration updates, plus announcements from the team.</p>
          </div>
          <div className="udash-avatar">
            <Bell size={30} fill="currentColor" />
          </div>
        </div>

        <div className="udash-panel">
          <div className="udash-panel-head">
            <h3>All notifications {unread > 0 && <em>({unread} unread)</em>}</h3>
            {unread > 0 && (
              <button className="udash-viewall" onClick={handleMarkAll}>
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>

          {loading ? (
            <div className="udash-empty">
              <p>Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="udash-empty">
              <Bell size={32} />
              <p>Nothing new yet.</p>
              <p>You'll see payment, registration and admin updates here.</p>
            </div>
          ) : (
            <div className="udash-eventlist">
              {notifications.map((n) => (
                <div
                  className={`udash-event notif-row${n.isRead ? " read" : " unread"}`}
                  key={n.id}
                  onClick={() => handleRead(n)}
                >
                  <div className="notif-dot" />
                  <div style={{ flex: 1 }}>
                    {n.title && <strong>{n.title}</strong>}
                    <p style={{ margin: "2px 0 4px", fontSize: 14 }}>{n.message}</p>
                    <span style={{ fontSize: 12, color: "#9A8FB0" }}>{timeAgo(n.createdAt)}</span>
                  </div>
                  {!n.isRead && <span className="notif-new">New</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </section>
      <Footer />
    </>
  );
}