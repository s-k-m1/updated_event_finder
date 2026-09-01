import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { resetPassword } from "./api";
import "./Login.css";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });
    if (form.password.length < 6) {
      setStatus({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }
    if (form.password !== form.confirm) {
      setStatus({ type: "error", text: "Passwords do not match" });
      return;
    }
    setLoading(true);
    try {
      const data = await resetPassword(token, form.password);
      setStatus({ type: "success", text: data.message });
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="brand">
          <div className="brand-icon"><MapPin /></div>
          <div>
            <h3>LocalEvent</h3>
            <p>FINDER • NEPAL</p>
          </div>
        </div>

        <h1 className="left-title">
          Set a new <span>Password</span>
        </h1>

        <p className="left-desc">
          Choose a strong, new password for your LocalEvent Finder account.
          Make sure it's different from previous ones.
        </p>

        <ul className="left-list">
          <li>Minimum 6 characters</li>
          <li>Use a mix of letters, numbers and symbols</li>
          <li>Don't reuse passwords from other sites</li>
        </ul>
      </div>

      <div className="login-right">
        <div className="form-container">
          <h2 className="form-title">Create new password</h2>
          <p className="form-subtitle">
            {token ? "Almost done — enter your new password." : "This reset link is invalid or expired."}
          </p>

          {token ? (
            <form className="form" onSubmit={handleSubmit}>
              <label>New Password</label>
              <div className="input-group">
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="New password"
                  required
                />
              </div>

              <label>Confirm Password</label>
              <div className="input-group">
                <input
                  type="password"
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder="Re-type new password"
                  required
                />
              </div>

              {status.text && (
                <p className={`form-message ${status.type}`}>{status.text}</p>
              )}

              <button type="submit" className="btn" disabled={loading}>
                {loading ? "Saving…" : "Update Password →"}
              </button>

              <div className="divider">
                <span>or</span>
              </div>

              <p className="login-link">
                <Link to="/login">Back to login →</Link>
              </p>
            </form>
          ) : (
            <>
              {status.text && (
                <p className={`form-message ${status.type}`}>{status.text}</p>
              )}
              <div className="divider">
                <span>or</span>
              </div>
              <p className="login-link">
                <Link to="/forgot-password">Request a new link →</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;