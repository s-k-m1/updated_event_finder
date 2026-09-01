import React, { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import { adminGetSubscribers } from "../api";
import Pagination from "./Pagination";

const PER_PAGE = 10;

const AdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    adminGetSubscribers().then(setSubscribers).catch(console.error);
  }, []);

  const pageCount = Math.max(1, Math.ceil(subscribers.length / PER_PAGE));
  const safePage = Math.min(page, pageCount);
  const paginatedSubscribers = subscribers.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Subscribers</h1>

      <div className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr><th>Email</th><th>Subscribed</th></tr>
          </thead>
          <tbody>
            {paginatedSubscribers.map((s) => (
              <tr key={s.id}>
                <td><Mail size={14} className="admin-inline-icon" /> {s.email}</td>
                <td>{new Date(s.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr><td colSpan={2} className="admin-empty">No subscribers yet</td></tr>
            )}
          </tbody>
        </table>
        <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default AdminSubscribers;