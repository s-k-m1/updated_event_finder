import React from "react";
import { useAuth } from "../context/AuthContext";
import { User as UserIcon, Mail, Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const avatar = (user?.fullName || "A").charAt(0).toUpperCase();

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1 className="admin-page-title">My Profile</h1>
        <button className="admin-btn ghost" onClick={() => navigate("/admin")}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </div>

      <div className="admin-profile-card">
        <div className="admin-profile-avatar">
          <div className="admin-avatar large">{avatar}</div>
          <div>
            <h2>{user?.fullName || "Admin"}</h2>
            <span className="admin-role">{user?.role}</span>
          </div>
        </div>

        <div className="admin-profile-info">
          <div className="admin-profile-row">
            <Mail size={16} />
            <span>Email</span>
            <strong>{user?.email || "—"}</strong>
          </div>
          <div className="admin-profile-row">
            <UserIcon size={16} />
            <span>Full Name</span>
            <strong>{user?.fullName || "—"}</strong>
          </div>
          <div className="admin-profile-row">
            <Shield size={16} />
            <span>Role</span>
            <strong>{user?.role || "—"}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
