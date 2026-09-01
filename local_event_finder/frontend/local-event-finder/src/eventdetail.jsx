import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Star, ArrowLeft, Heart, Users, Share2, ShieldCheck, ChevronLeft } from "lucide-react";
import Navigation from "./home/navigationbar.jsx";
import Footer from "./home/Footer.jsx";
import { getEvent, getSavedIds, saveEvent, unsaveEvent, getRegistrationStatus, registerForEvent, unregisterEvent } from "./api";
import { useAuth } from "./context/AuthContext";
import { useToast } from "./context/ToastContext";
import "./eventdetail.css";

export default function EventDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error: toastError, info: toastInfo } = useToast();
  const [event, setEvent] = useState(null);
  const [missing, setMissing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [paymentPending, setPaymentPending] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setEvent(null);
    setMissing(false);
    getEvent(slug)
      .then((e) => {
        setEvent(e);
        if (user) {
          getSavedIds()
            .then((d) => setSaved(d.ids.includes(e.id)))
            .catch(() => {});
          getRegistrationStatus(slug)
            .then((d) => {
              setRegistered(d.registered);
              setPaymentPending(d.registered && d.paymentStatus === "pending");
            })
            .catch(() => {});
        }
      })
      .catch(() => setMissing(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    if (user && event) {
      getSavedIds()
        .then((d) => setSaved(d.ids.includes(event.id)))
        .catch(() => {});
      getRegistrationStatus(slug)
        .then((d) => {
          setRegistered(d.registered);
          setPaymentPending(d.registered && d.paymentStatus === "pending");
        })
        .catch(() => {});
    } else if (!user) {
      setSaved(false);
      setRegistered(false);
      setPaymentPending(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, event]);

  const toggleSave = (e) => {
    e.preventDefault();
    if (!user) { navigate("/login"); return; }
    const next = !saved;
    setSaved(next);
    const action = next ? saveEvent : unsaveEvent;
    action(event.id).catch(() => setSaved(!next));
  };

  const toggleRegister = () => {
    if (!user) { navigate("/login"); return; }
    const price = Number(event.price_value) || 0;
    // Paid event: open the Khalti modal (also for resuming a pending payment).
    if (price > 0 && !registered) { setPaymentOpen(true); return; }
    // Paid event with pending payment: resume instead of cancel.
    if (price > 0 && paymentPending) { setPaymentOpen(true); return; }
    const next = !registered;
    setRegistered(next);
    setPaymentPending(false);
    const action = next ? registerForEvent : unregisterEvent;
    action(slug)
      .then(() => {
        if (next) {
          success("Registration successful! You're registered for this event.");
          setTimeout(() => navigate("/dashboard"), 1200);
        }
      })
      .catch(() => setRegistered(!next));
  };

  const closePayment = () => {
    if (paying) return;
    setPaymentOpen(false);
  };

  const handleKhaltiPay = async () => {
    if (!event) return;

    setPaying(true);
    try {
      const res = await registerForEvent(slug);
      if (res && res.pending && res.paymentUrl) {
        window.location.href = res.paymentUrl;
        return;
      }
      setPaying(false);
      // Only treat as registered when the backend explicitly confirms a paid/free booking.
      if (res && res.registered) {
        setPaymentOpen(false);
        setRegistered(true);
        success("You're registered for this event.");
        setTimeout(() => navigate("/dashboard"), 1200);
      } else {
        toastError("Could not start the payment. Please try again.");
      }
    } catch (e) {
      console.error(e);
      setPaying(false);
      toastError(e?.message || "Could not start the payment. Please try again.");
    }
  };

  if (missing) {
    return (
      <>
        <Navigation />
        <section className="event-detail-missing">
          <h2>Event not found</h2>
          <p>The event you're looking for doesn't exist or was removed.</p>
          <button onClick={() => navigate("/event")}>Back to events</button>
        </section>
        <Footer />
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Navigation />
        <section className="event-detail-loading">Loading...</section>
        <Footer />
      </>
    );
  }

  const city = event.city ? event.city.charAt(0).toUpperCase() + event.city.slice(1) : "";

  return (
    <>
      <Navigation />
      <section className="event-detail">
        <button className="detail-back" onClick={() => navigate(-1)}>
          <ArrowLeft /> Back
        </button>

        <div className="detail-hero">
          <img src={event.image} alt={event.title} />
          <div className="detail-overlay"></div>
          <button className="detail-heart" onClick={toggleSave} title={saved ? "Saved" : "Save event"}>
            <Heart className={saved ? "saved" : ""} />
          </button>
          <div className="detail-heading">
            {event.badge && <span className="detail-badge">{event.badge}</span>}
            <h1>{event.title}</h1>
            <div className="detail-meta">
              <span>{event.category}</span>
              <span className="rating"><Star /> {event.rating}</span>
            </div>
          </div>
        </div>

        <div className="detail-layout">
          <div className="detail-main">
            <h2>About this event</h2>
            <p className="detail-description">{event.description}</p>

            <div className="detail-info-grid">
              <div className="info-card">
                <Calendar />
                <div>
                  <small>Date</small>
                  <strong>{event.date}</strong>
                </div>
              </div>
              <div className="info-card">
                <Clock />
                <div>
                  <small>Time</small>
                  <strong>{event.time}</strong>
                </div>
              </div>
              <div className="info-card">
                <MapPin />
                <div>
                  <small>Location</small>
                  <strong>{event.location}</strong>
                  {city && <em>{city}</em>}
                </div>
              </div>
              <div className="info-card">
                <Users />
                <div>
                  <small>Organizer</small>
                  <strong>{event.organizer || "Local Event Finder Team"}</strong>
                  {event.attendees > 0 && <em>{event.attendees}+ attending</em>}
                </div>
              </div>
            </div>
          </div>

          <div className="detail-side">
            <div className="detail-ticket">
              <small>Price</small>
              <h3>{event.price}</h3>
              <button className={`register-btn ${registered ? "registered" : ""}`} onClick={toggleRegister}>
                {!user
                  ? "Log in to register"
                  : paymentPending
                    ? "Resume pending payment"
                    : registered
                      ? "Registered — cancel"
                      : "Register for this event"}
              </button>
              <button className="share-btn" onClick={() => navigator.share ? navigator.share({ title: event.title, url: window.location.href }).catch(() => {}) : navigator.clipboard.writeText(window.location.href).then(() => toastInfo("Link copied to clipboard!"))}>
                <Share2 /> Share event
              </button>
            </div>
          </div>
        </div>
      </section>

      {paymentOpen && (
        <div className="pay-overlay" onClick={closePayment}>
          <div className="pay-modal khalti-modal" onClick={(e) => e.stopPropagation()}>

            <div className="kh-modal-head">
              <button className="kh-back" onClick={closePayment} title="Go back">
                <ChevronLeft size={18} /> Back
              </button>
              <button className="pay-close" onClick={closePayment} title="Close">✕</button>
            </div>

            <div className="kh-brand">
              <span className="kh-logo">Khalti</span>
              <span className="kh-brand-secure">
                <ShieldCheck size={14} /> Secured by Khalti
              </span>
            </div>

            <div className="kh-amount">
              <span>Amount to pay</span>
              <strong>{event.price}</strong>
            </div>

            <div className="kh-details">
              <div className="kh-row">
                <span>Event</span>
                <strong>{event.title}</strong>
              </div>
              <div className="kh-row">
                <span>Payment method</span>
                <strong className="kh-method-khalti">Khalti</strong>
              </div>
            </div>

            <button className="khalti-pay-btn" onClick={handleKhaltiPay} disabled={paying}>
              {paying ? "Redirecting to Khalti…" : `Continue to Khalti — Pay Rs. ${Number(event.price_value) || event.price}`}
            </button>

            <p className="kh-forgot">
              Forgot your Khalti Pin?{" "}
              <a className="kh-forgot-link" href="https://khalti.com" target="_blank" rel="noopener noreferrer">
                Click here
              </a>{" "}
              to reset
            </p>

            <div className="khalti-note">
              You'll be redirected to Khalti's secure checkout to complete your payment.
            </div>

          </div>
        </div>
      )}
      <Footer />
    </>
  );
}