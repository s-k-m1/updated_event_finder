import React, { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { adminGetNotifications, adminSendNotification, adminGetUsers } from "../api";
import Pagination from "./Pagination";

const PER_PAGE = 10;

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ title: "", message: "", userId: "" });
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [page, setPage] = useState(1);

  const load = () => {
    adminGetNotifications().then((d) => setNotifications(d.notifications)).catch(console.error);
    adminGetUsers().then(setUsers).catch(console.error);
    setPage(1);
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setMessage("");
    try {
      const payload = {
        title: form.title,
        message: form.message,
        ...(form.userId ? { userId: Number(form.userId) } : {}),
      };
      const res = await adminSendNotification(payload);
      setMessage(`Notification sent to ${res.recipients} user${res.recipients === 1 ? "" : "s"}`);
      setForm({ title: "", message: "", userId: "" });
      load();
    } catch (err) {
      setMessage(err.message);
      setSending(false);
      return;
    }
    setSending(false);
  };

  const pageCount = Math.max(1, Math.ceil(notifications.length / PER_PAGE));
  const safePage = Math.min(page, pageCount);
  const paginatedNotifications = notifications.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1 className="admin-page-title">Notifications</h1>
      </div>

      {message && <div className="admin-message">{message}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-head">
          <h2>Send Notification</h2>
        </div>
        <div className="admin-form-grid">
          <label>Title
            <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. New Event Alert" required />
          </label>
          <label>Send to
            <select name="userId" value={form.userId} onChange={handleChange}>
              <option value="">All users</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>
              ))}
            </select>
          </label>
        </div>
        <label>Message
          <textarea name="message" rows="3" value={form.message} onChange={handleChange} placeholder="Message text shown in users' notification bell..." required />
        </label>
        <button className="admin-btn primary" type="submit" disabled={sending}>
          <Send size={16} /> {sending ? "Sending..." : "Send Notification"}
        </button>
      </form>

      <div className="admin-panel" style={{ marginTop: 25 }}>
        <h3 style={{ margin: "0 0 15px", color: "#33225E" }}>Recently Sent</h3>
        <table className="admin-table">
          <thead>
            <tr><th>Title</th><th>Message</th><th>Recipient</th><th>Read</th><th>Date</th></tr>
          </thead>
          <tbody>
            {paginatedNotifications.map((n) => (
              <tr key={n.id}>
                <td>{n.title}</td>
                <td>{n.message}</td>
                <td>{n.userName || `User #${n.userId}`}</td>
                <td>{n.isRead ? "✓" : "•"}</td>
                <td>{new Date(n.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {notifications.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: "center", color: "#8a8a96", padding: 20 }}>
                <Send size={16} style={{ verticalAlign: "-3px", marginRight: 6 }} />No notifications yet.
              </td></tr>
            )}
          </tbody>
        </table>
        <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default AdminNotifications;