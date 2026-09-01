import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Mail } from "lucide-react";
import {
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaYoutube
} from "react-icons/fa";
import { subscribeNewsletter } from "../api";
import "./footer.css";
export default function Footer() {

  const [email, setEmail] = useState("");
  const [email2, setEmail2] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e, value) => {
    e.preventDefault();
    try {
      await subscribeNewsletter(value.trim());
      setMessage("Subscribed successfully!");
      setEmail("");
      setEmail2("");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (

    <footer className="footer">


      <div className="footer-container">


        <div className="footer-main">


          {/* Brand */}

          <div className="footer-brand">


            <div className="footer-logo">

              <div className="logo-icon">
                <MapPin />
              </div>

              <div>
                <h3>
                  Local<span>Event</span>
                </h3>

                <p>
                  FINDER · NEPAL
                </p>

              </div>

            </div>

            <p className="footer-description">
              Nepal's premier event discovery platform.
              Find, register, and experience the best
              local events from Kathmandu to Pokhara.
            </p>
            <div className="social-icons">

              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter />
              </a>

              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>

              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <FaYoutube />
              </a></div>

          </div>
          {/* Platform */}

          <div className="footer-column">

            <h4>
              Platform
            </h4>
            <Link to="/event">Browse Events</Link>
            <Link to="/create-event">Create Event</Link>
            <Link to="/categories">Categories</Link>
            <Link to="/event">Map View</Link>
            <Link to="/event">Live Events</Link>
            <Link to="/registrations">My Registrations</Link>

          </div>
          {/* Company */}

          <div className="footer-column">

            <h4>
              Company
            </h4>
            <Link to="/about">About Us</Link>
            <Link to="/about">Contact</Link>
            <Link to="/about">Privacy Policy</Link>
            <Link to="/about">Terms of Service</Link>
            <Link to="/about">Help Center</Link>
            <Link to="/about">Blog</Link>
          </div>
          {/* Newsletter */}

          <div className="footer-newsletter">

            <h4>
              STAY UPDATED
            </h4>
            <p>
              Get weekly event picks delivered straight
              to your inbox.
            </p>
            <form className="newsletter-box" onSubmit={(e) => handleSubscribe(e, email)}>

              <input
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button type="submit">
                Subscribe
              </button>
            </form>
            {message && <p className="subscribe-message">{message}</p>}
          </div>
        </div>
        {/* Bottom Newsletter */}


        <div className="footer-subscribe">
          <div className="subscribe-text">
            <div className="mail-icon">

              <Mail />

            </div>
            <div>
              <h3>
                Get weekly event picks
              </h3>

              <p>
                Curated events, straight to your inbox. No spam.
              </p>
            </div>
          </div>
          <form className="subscribe-form" onSubmit={(e) => handleSubscribe(e, email2)}>

            <input
              placeholder="you@example.com"
              value={email2}
              onChange={(e) => setEmail2(e.target.value)}
            />
            <button type="submit">
              Subscribe
            </button>
          </form>
        </div>
        {/* Bottom Bar */}


        <div className="footer-bottom">


          <p>
            © 2025 Local Event Finder — Nepal. All rights reserved.
          </p>


          <div className="footer-links">

            <Link to="/about">
              Privacy
            </Link>

            <Link to="/about">
              Terms
            </Link>

            <Link to="/about">
              Cookies
            </Link>


          </div>
        </div>
      </div>
    </footer>
  );

}