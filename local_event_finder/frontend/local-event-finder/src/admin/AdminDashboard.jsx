import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  FolderTree,
  Users,
  Mail,
  Ticket,
  TrendingUp,
  Star,
  Bell,
  Radio,
} from "lucide-react";
import { adminGetStats, getEvents, getCategories, adminGetNotifications, getLiveEvents } from "../api";
import Pagination from "./Pagination";

const PER_PAGE = 10;

const AdminDashboard = () => {
  const [stats, setStats] = useState({ events: 0, categories: 0, users: 0, subscribers: 0, registrations: 0 });
  const [topEvents, setTopEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [liveCount, setLiveCount] = useState(0);
  const [latestEvents, setLatestEvents] = useState([]);
  const [topPage, setTopPage] = useState(1);

  useEffect(() => {
    adminGetStats().then(setStats).catch(console.error);
    getEvents("?sort=popular").then(setTopEvents).catch(() => {});
    getEvents().then((d) => setLatestEvents(d.slice(0, 5))).catch(() => {});
    getCategories().then(setCategories).catch(() => {});
    adminGetNotifications().then((d) => setNotifications(d.notifications.slice(0, 5))).catch(() => {});
    getLiveEvents().then((d) => setLiveCount(d.length)).catch(() => {});
  }, []);

  const cards = [
    { label: "Events", value: stats.events, icon: CalendarDays, to: "/admin/events", color: "#8A6FC4" },    { label: "Categories", value: stats.categories, icon: FolderTree, to: "/admin/categories", color: "#4A90D9" },
    { label: "Users", value: stats.users, icon: Users, to: "/admin/users", color: "#2D9E6B" },
    { label: "Registrations", value: stats.registrations, icon: Ticket, to: "/admin/events", color: "#E0863B" },
    { label: "Subscribers", value: stats.subscribers, icon: Mail, to: "/admin/subscribers", color: "#C0457B" },
  ];

  const topPageCount = Math.max(1, Math.ceil(topEvents.length / PER_PAGE));
  const topSafePage = Math.min(topPage, topPageCount);
  const paginatedTopEvents = topEvents.slice((topSafePage - 1) * PER_PAGE, topSafePage * PER_PAGE);

  return (
    <div className="admin-dashboard">
      <h1 className="admin-page-title">Dashboard</h1>

      <div className="admin-cards">
        {cards.map(({ label, value, icon: Icon, to, color }) => (
          <Link to={to} key={label} className="admin-card" style={{ borderTop: `3px solid ${color}` }}>
            <div className="admin-card-icon" style={{ background: color + "22", color }}>
              <Icon size={22} />
            </div>
            <div>
              <div className="admin-card-value">{value}</div>
              <div className="admin-card-label">{label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="admin-dash-grid">
        <div className="admin-panel">
          <h2 className="admin-panel-title">
            <TrendingUp size={18} /> Popular Events
          </h2>
          <table className="admin-table">
            <thead>
              <tr><th>Event</th><th>Category</th><th>Price</th><th>Attendees</th><th>Rating</th></tr>
            </thead>
            <tbody>
              {paginatedTopEvents.map((e) => (
                <tr key={e.id}>
                  <td>{e.title}</td>
                  <td>{e.category}</td>
                  <td>{e.price}</td>
                  <td>{e.attendees}</td>
                  <td><span className="rate"><Star size={13} /> {e.rating}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={topPage} pageCount={topPageCount} onPageChange={setTopPage} />
        </div>

        <div className="admin-panel">
          <h2 className="admin-panel-title">
            <Radio size={18} /> Live Now
          </h2>
          <div className="admin-live-count">
            <span>{liveCount}</span>
            <p>events happening right now</p>
          </div>
          <table className="admin-table">
            <thead>
              <tr><th>Latest Events</th><th>Date</th></tr>
            </thead>
            <tbody>
              {latestEvents.map((e) => (
                <tr key={e.id}>
                  <td>{e.title}</td>
                  <td>{e.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-dash-grid">
        <div className="admin-panel">
          <h2 className="admin-panel-title">
            <FolderTree size={18} /> Categories
          </h2>
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Events</th></tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.eventCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-panel">
          <h2 className="admin-panel-title">
            <Bell size={18} /> Recent Notifications
          </h2>
          <div className="admin-notif-list">
            {notifications.map((n) => (
              <div className="admin-notif-row" key={n.id}>
                <div>
                  <strong>{n.title}</strong>
                  <p>{n.message}</p>
                </div>
                <span>→ {n.userName || `User #${n.userId}`}</span>
              </div>
            ))}
            {notifications.length === 0 && (
              <p className="admin-empty">No notifications sent yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;