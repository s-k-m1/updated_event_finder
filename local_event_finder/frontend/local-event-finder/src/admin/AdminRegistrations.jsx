import React, { useState, useEffect } from "react";
import { Check, X, AlertTriangle } from "lucide-react";
import {
  adminGetRegistrations,
  adminSetRegistrationStatus,
} from "../api";
import Pagination from "./Pagination";

const PER_PAGE = 10;

const statusClass = (s) =>
  s === "accepted" ? "reg-accepted" : s === "declined" ? "reg-declined" : "reg-pending";

const statusLabel = (s) =>
  s === "accepted" ? "Accepted" : s === "declined" ? "Declined" : "Pending";

const AdminRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [confirmDecline, setConfirmDecline] = useState(null);

  const load = () => {
    setLoading(true);
    adminGetRegistrations()
      .then((d) => setRegistrations(d.registrations || []))
      .catch((err) => setMessage(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const setStatus = (id, status) => {
    adminSetRegistrationStatus(id, status)
      .then((res) => {
        setMessage(res.message || "Registration updated");
        setConfirmDecline(null);
        load();
      })
      .catch((err) => setMessage(err.message));
  };

  const formatDate = (ts) => {
    try {
      return new Date(ts).toLocaleString();
    } catch {
      return ts;
    }
  };

  const pageCount = Math.max(1, Math.ceil(registrations.length / PER_PAGE));
  const safePage = Math.min(page, pageCount);
  const paginated = registrations.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1 className="admin-page-title">Registrations</h1>
        <button className="admin-btn primary" onClick={load}>
          Refresh
        </button>
      </div>

      {message && <div className="admin-message">{message}</div>}

      <div className="admin-panel">
        {loading ? (
          <p className="admin-empty">Loading registrations...</p>
        ) : registrations.length === 0 ? (
          <p className="admin-empty">No registrations yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Event</th>
                <th>Registration Date</th>
                <th>Payment Method</th>
                <th>Payment Status</th>
                <th>Registration Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="admin-user-cell">
                      <strong>{r.userName}</strong>
                      <span>{r.userEmail}</span>
                    </div>
                  </td>
                  <td>{r.eventTitle}</td>
                  <td>{formatDate(r.registeredAt)}</td>
                  <td>
                    <span className="pay-chip">{r.paymentMethod || "Free"}</span>
                  </td>
                  <td>
                    <span className={`pay-chip ${r.paymentStatus === "paid" ? "paid" : "pending"}`}>
                      {r.paymentStatus || "—"}
                    </span>
                  </td>
                  <td>
                    <span className={`reg-chip ${statusClass(r.registrationStatus)}`}>
                      {statusLabel(r.registrationStatus)}
                    </span>
                  </td>
                  <td className="admin-row-actions">
                    {r.registrationStatus !== "accepted" && (
                      <button
                        className="admin-btn small"
                        title="Accept registration"
                        onClick={() => setStatus(r.id, "accepted")}
                      >
                        <Check size={14} /> Accept
                      </button>
                    )}
                    {r.registrationStatus !== "declined" && (
                      <button
                        className="admin-btn small danger"
                        title="Decline registration"
                        onClick={() => setConfirmDecline(r)}
                      >
                        <X size={14} /> Decline
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
      </div>

      {confirmDecline && (
        <div className="admin-confirm-overlay" onClick={() => setConfirmDecline(null)}>
          <div className="admin-confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <AlertTriangle size={34} className="admin-confirm-icon" />
            <h3>Decline this registration?</h3>
            <p>
              <strong>{confirmDecline.userName}</strong> — {confirmDecline.eventTitle}
              <br />
              The user will be notified that their registration has been declined.
            </p>
            <div className="admin-confirm-actions">
              <button className="admin-btn ghost" onClick={() => setConfirmDecline(null)}>
                Cancel
              </button>
              <button
                className="admin-btn danger"
                onClick={() => setStatus(confirmDecline.id, "declined")}
              >
                Yes, Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRegistrations;