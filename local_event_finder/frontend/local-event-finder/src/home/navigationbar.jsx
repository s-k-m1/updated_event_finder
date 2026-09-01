import React, { useState, useRef, useEffect } from "react";
import { MapPin, Bell, LayoutDashboard, LogOut, Heart, Ticket, PlusCircle, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "../api";
import "./navigation.css";
function Navigation() {
   const { user, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (e.target.closest(".navbar") === null) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnread(0);
      return;
    }
    const loadNotifs = () => {
      getNotifications()
        .then((d) => {
          setNotifications(d.notifications);
          setUnread(d.unreadCount);
        })
        .catch((err) => console.error("Failed to load notifications:", err));
    };
    loadNotifs();
    const interval = setInterval(loadNotifs, 15000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (notifOpen && user) {
      getNotifications()
        .then((d) => {
          setNotifications(d.notifications);
          setUnread(d.unreadCount);
        })
        .catch(() => {});
    }
  }, [notifOpen, user]);

  const handleLogout = () => {
    logout();
    success("Logout successful. See you soon!");
    navigate("/");
  };

  const timeAgo = (ts) => {
    const diff = Math.max(1, Math.floor((Date.now() - new Date(ts).getTime()) / 60000));
    if (diff < 60) return `${diff}m`;
    const h = Math.floor(diff / 60);
    if (h < 24) return `${h}h`;
    return `${Math.floor(h / 24)}d`;
  };

  const handleNotificationClick = (n) => {
    if (!n.isRead) {
      markNotificationRead(n.id)
        .then(() => {
          setUnread((u) => Math.max(0, u - 1));
          setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)));
        })
        .catch(() => {});
    }
  };

  const handleMarkAllRead = () => {
    if (unread === 0) return;
    markAllNotificationsRead()
      .then(() => {
        setUnread(0);
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      })
      .catch(() => {});
  };

  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="logo-section">
        <div className="logo-icon">
          <MapPin size={24} />
        </div>

        <div className="logo-text">
          <h2>
            Local<span>Event</span>
          </h2>
          <p>FINDER · NEPAL</p>
        </div>
      </div>

      {/* Navigation Links */}

<div className="nav-links">
<Link to="/" className={isActive("/") ? "active" : ""}>Home</Link>
<Link to="/event" className={isActive("/event") ? "active" : ""}>Events</Link>
<Link to="/categories" className={isActive("/categories") ? "active" : ""}>Categories</Link>
<Link to="/about" className={isActive("/about") ? "active" : ""}>About</Link>

</div>

{/* Mobile Menu Toggle */}
<div className="nav-toggle" onClick={() => { setMenuOpen(!menuOpen); setProfileOpen(false); setNotifOpen(false); }} aria-label="Toggle menu">
{menuOpen ? <X size={26} /> : <Menu size={26} />}
</div>

{menuOpen && (
  <>
    <div className="mobile-overlay" onClick={() => setMenuOpen(false)} aria-label="Close menu"></div>
    <div className="mobile-sidebar">
      <button className="sidebar-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
        <X size={22} />
      </button>
      <Link to="/" onClick={() => setMenuOpen(false)} className={isActive("/") ? "active" : ""}>Home</Link>
      <Link to="/event" onClick={() => setMenuOpen(false)} className={isActive("/event") ? "active" : ""}>Events</Link>
      <Link to="/categories" onClick={() => setMenuOpen(false)} className={isActive("/categories") ? "active" : ""}>Categories</Link>
      <Link to="/about" onClick={() => setMenuOpen(false)} className={isActive("/about") ? "active" : ""}>About</Link>
      {!user ? (
        <>
          <Link to="/login" className="login" onClick={() => setMenuOpen(false)}>Login</Link>
          <Link to="/signup" className="signup" onClick={() => setMenuOpen(false)}>
            <span>+</span> Sign Up
          </Link>
        </>
      ) : (
        <Link to="/saved" className="login" onClick={() => setMenuOpen(false)}>Logout</Link>
      )}
    </div>
  </>
)}



      {/* Right Section */}
      <div className="nav-actions">
        <div className="nav-icon-wrap" ref={notifRef} onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}>
          <Bell className="nav-icon" size={22} />
          {unread > 0 && <span className="nav-dot">{unread > 99 ? "99+" : unread}</span>}
          {notifOpen && (
            <div className="nav-dropdown notif-dropdown">
              <div className="nav-dropdown-title">
                Notifications
                {unread > 0 && (
                  <button className="mark-all-read" onClick={handleMarkAllRead}>Mark all read</button>
                )}
              </div>
              {notifications.length === 0 ? (
                <div className="notif-item">
                  <p>Nothing new yet.</p>
                  <span>Check back soon</span>
                </div>
              ) : (
                notifications.map((n) => (
                  <div className={`notif-item${n.isRead ? "" : " unread"}`} key={n.id} onClick={() => handleNotificationClick(n)}>
                    {n.title && <strong className="notif-title">{n.title}</strong>}
                    <p>{n.message}</p>
                    <span>{timeAgo(n.createdAt)} ago{n.isRead ? "" : " • new"}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {user ? (
          <div className="nav-icon-wrap" ref={profileRef} onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}>
            <div className="nav-profile-avatar">{user.fullName.charAt(0).toUpperCase()}</div>
            {profileOpen && (
              <div className="nav-dropdown profile-dropdown">
                <div className="nav-dropdown-user">
                  <strong>{user.fullName}</strong>
                  <span>{user.email}</span>
                  <span className="nav-dropdown-role">{user.role}</span>
                </div>
                {user.role === "admin" && (
                  <Link to="/admin" className="nav-dropdown-item">
                    <LayoutDashboard size={15} /> Admin Dashboard
                  </Link>
                )}
                {user.role !== "admin" && (
                  <Link to="/dashboard" className="nav-dropdown-item">
                    <LayoutDashboard size={15} /> My Dashboard
                  </Link>
                )}
                <Link to="/saved" className="nav-dropdown-item">
                  <Heart size={15} /> Saved Events
                </Link>
                <Link to="/registrations" className="nav-dropdown-item">
                  <Ticket size={15} /> My Registrations
                </Link>
                {user.role === "admin" && (
                  <Link to="/create-event" className="nav-dropdown-item">
                    <PlusCircle size={15} /> Create Event
                  </Link>
                )}
                <button className="nav-dropdown-item" onClick={handleLogout}>
                  <LogOut size={15} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="login">Login</Link>
            <Link to="/signup" className="signup">
              <span>+</span> Sign Up
            </Link>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navigation;