import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useAuth } from "./context/AuthContext";
import { useToast } from "./context/ToastContext";
import "./Login.css";

const Login = () => {
  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });
    try {
      const user = await login(form.email, form.password);
      setStatus({ type: "success", text: "Login successful. Welcome back!" });
      success("Login successful. Welcome back!");
      if (user.role === "admin") navigate("/admin");
      else navigate("/");
    } catch (err) {
      setStatus({ type: "error", text: err.message });
      toastError(err.message);
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
          Welcome Back to <span>Your Events</span>
        </h1>

        <p className="left-desc">
          Sign in to discover, register, and attend the best local events
          across Nepal — from Kathmandu to Pokhara.
        </p>

        <ul className="left-list">
          <li>500+ events listed across Nepal every month</li>
          <li>12,000+ registered attendees and growing</li>
          <li>4.9★ average rating from event-goers</li>
          <li>Admins can manage events from one dashboard</li>
        </ul>
      </div>

      <div className="login-right">
        <div className="form-container">
          <h2 className="form-title">Log in to your account</h2>
          <p className="form-subtitle">
            Pick up where you left off.
          </p>

          <form className="form" onSubmit={handleSubmit}>

            <label>Email Address</label>
            <div className="input-group">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>

            <label>Password</label>
            <div className="input-group">
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Your password"
              />
            </div>

            <div className="forgot-row">
              <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
            </div>

            {status.text && (
              <p className={`form-message ${status.type}`}>{status.text}</p>
            )}

            <button type="submit" className="btn">
              Log In →
            </button>

            <div className="divider">
              <span>or</span>
            </div>

            <p className="login-link">
              Don't have an account? <Link to="/signup">Create one →</Link>
            </p>

          </form>
        </div>
      </div>

    </div>
  );
};

export default Login;