import React, { useState, useEffect } from "react";
import { Pencil, Trash2, X, Plus } from "lucide-react";
import { adminGetUsers, adminUpdateUserRole, adminUpdateUser, adminDeleteUser, registerUser } from "../api";
import { useAuth } from "../context/AuthContext";
import Pagination from "./Pagination";

const PER_PAGE = 10;

const emptyForm = { full_name: "", email: "", phone: "", role: "user", password: "", isFormOpen: false };

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [page, setPage] = useState(1);

  const load = () => { adminGetUsers().then(setUsers).catch(console.error); setPage(1); };
  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const openCreate = () => { setEditing(null); setForm({ ...emptyForm, isFormOpen: true }); };
  const openEdit = (u) => {
    setEditing(u);
    setForm({ full_name: u.full_name, email: u.email, phone: u.phone || "", role: u.role, password: "", isFormOpen: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await adminUpdateUser(editing.id, { fullName: form.full_name, phone: form.phone, role: form.role });
        setMessage("User updated successfully");
      } else {
        await registerUser({ fullName: form.full_name, email: form.email, phone: form.phone, password: form.password, role: form.role });
        setMessage("User created successfully");
      }
      setEditing(null);
      setForm(emptyForm);
      load();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await adminUpdateUserRole(id, role);
      load();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await adminDeleteUser(id);
      load();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const pageCount = Math.max(1, Math.ceil(users.length / PER_PAGE));
  const safePage = Math.min(page, pageCount);
  const paginatedUsers = users.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1 className="admin-page-title">Users</h1>
        <button className="admin-btn primary" onClick={openCreate}><Plus size={16} /> New User</button>
      </div>

      {message && <div className="admin-message">{message}</div>}

      {form.isFormOpen ? (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-head">
            <h2>{editing ? "Edit User" : "Create User"}</h2>
            <button type="button" className="admin-btn ghost" onClick={() => { setEditing(null); setForm(emptyForm); }}>
              <X size={16} /> Close
            </button>
          </div>
          <div className="admin-form-grid">
            <label>Full name <input name="full_name" value={form.full_name} onChange={handleChange} required /></label>
            <label>Phone <input name="phone" value={form.phone} onChange={handleChange} /></label>
            <label>Role
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </label>
            {!editing && (
              <>
                <label>Email <input name="email" type="email" value={form.email} onChange={handleChange} required /></label>
                <label>Password <input name="password" type="password" value={form.password} onChange={handleChange} required /></label>
              </>
            )}
          </div>
          <button className="admin-btn primary" type="submit">{editing ? "Update User" : "Create User"}</button>
        </form>
      ) : (
        <div className="admin-panel">
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th></th></tr>
            </thead>
            <tbody>
              {paginatedUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.full_name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || "—"}</td>
                  <td>
                    <select
                      className="admin-role-select"
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="admin-row-actions">
                    <button className="admin-btn small" onClick={() => openEdit(u)}><Pencil size={14} /></button>
                    {u.id !== currentUser?.id && (
                      <button className="admin-btn small danger" onClick={() => handleDelete(u.id)}>
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
};

export default AdminUsers;