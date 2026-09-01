import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  FolderTree,
  Users,
  Mail,
  Bell,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./admin.css";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/events", label: "Events", icon: CalendarDays },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/subscribers", label: "Subscribers", icon: Mail },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand" title="View profile" onClick={() => navigate("/admin/profile")}>
          Local<span>Event</span> Admin
        </div>

        <nav className="admin-nav">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => (isActive ? "admin-nav-item active" : "admin-nav-item")}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-link" onClick={() => navigate("/")}>
            <ArrowLeft size={18} /> Back to site
          </button>
          <button className="admin-link logout" onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-user" title="View profile" onClick={() => navigate("/admin/profile")}>
            <div className="admin-avatar">
              {(user?.fullName || "A").charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>{user?.fullName}</strong>
              <span className="admin-role">{user?.role}</span>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;