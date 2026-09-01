import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { forgotPassword } from "./api";
import "./Login.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });
    setLoading(true);
    try {
      const data = await forgotPassword(email);
      setStatus({ type: "success", text: data.message });
      setEmail("");
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
          Forgot your <span>Password?</span>
        </h1>

        <p className="left-desc">
          No worries — enter the email address you registered with and we'll
          send you a secure link to reset your password.
        </p>

        <ul className="left-list">
          <li>Reset link is valid for 30 minutes</li>
          <li>Comes straight to your inbox</li>
          <li>No account changes unless you confirm</li>
        </ul>
      </div>

      <div className="login-right">
        <div className="form-container">
          <h2 className="form-title">Reset your password</h2>
          <p className="form-subtitle">
            We'll email you a reset link.
          </p>

          <form className="form" onSubmit={handleSubmit}>
            <label>Email Address</label>
            <div className="input-group">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            {status.text && (
              <p className={`form-message ${status.type}`}>{status.text}</p>
            )}

            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Sending…" : "Send Reset Link →"}
            </button>

            <div className="divider">
              <span>or</span>
            </div>

            <p className="login-link">
              Remembered it? <Link to="/login">Back to login →</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;