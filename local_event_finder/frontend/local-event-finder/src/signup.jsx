import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useToast } from "./context/ToastContext";
import "./Signup.css";

const Signup = () => {
  const { register } = useAuth();
  const { success, error: toastError } = useToast();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirm: "" });
  const [status, setStatus] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });
    if (form.password !== form.confirm) {
      setStatus({ type: "error", text: "Passwords do not match." });
      return;
    }
    try {
      const user = await register({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      success("Registration successful! Your account has been created and you're now logged in.");
      setStatus({ type: "success", text: "Registration successful!" });
      if (user.role === "admin") navigate("/admin");
      else navigate("/dashboard");
    } catch (err) {
      setStatus({ type: "error", text: err.message });
      toastError(err.message);
    }
  };

  return (
    <div className="signup-page" id="signup-page">

      {/* LEFT SECTION */}
      <div className="signup-left" id="signup-left">

        <div className="brand" id="brand">
          <div className="brand-icon">📍</div>
          <div>
            <h3>LocalEvent</h3>
            <p>FINDER • NEPAL</p>
          </div>
        </div>

        <h1 className="left-title">
          Find the Upcoming & <span>Ongoing</span> Events Near You
        </h1>

        <p className="left-desc">
          Get registered and enjoy your time in your preferred events — making it
          memorable along with friends and family.
        </p>

        <ul className="left-list">
          <li>500+ events listed across Nepal every month</li>
          <li>12,000+ registered attendees and growing</li>
          <li>4.9★ average rating from event-goers</li>
          <li>Free to join, instant registration</li>
        </ul>

      </div>

      {/* RIGHT SECTION */}
      <div className="signup-right" id="signup-right">

        <div className="form-container">

          <h2 className="form-title">Create your account</h2>
          <p className="form-subtitle">
            Join thousands discovering events across Nepal.
          </p>

          <form className="form" onSubmit={handleSubmit}>

            <label>Full Name</label>
            <div className="input-group">
              <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Parika Bhandari" />
            </div>

            <label>Email Address</label>
            <div className="input-group">
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
            </div>

            <label>Phone Number</label>
            <div className="input-group">
              <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="+977 98XXXXXXXXX" />
            </div>

            <label>Password</label>
            <div className="input-group">
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Create a strong password" />
            </div>

            <label>Confirm Password</label>
            <div className="input-group">
              <input type="password" name="confirm" value={form.confirm} onChange={handleChange} placeholder="Repeat your password" />
            </div>

            <button type="submit" className="btn">
              Create Account →
            </button>

            {status.text && (
              <p className={`form-message ${status.type}`}>{status.text}</p>
            )}
            <div className="divider">
              <span>or</span>
            </div>

            <p className="login-link">
              Already have an account? <Link to="/login">Go to Login →</Link>
            </p>

          </form>

        </div>
      </div>

    </div>
  );
};

export default Signup;