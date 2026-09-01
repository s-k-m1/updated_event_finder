import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShieldCheck, CheckCircle2, XCircle, Clock } from "lucide-react";
import Navigation from "./home/navigationbar.jsx";
import Footer from "./home/Footer.jsx";
import { confirmKhaltiPayment } from "./api";
import "./eventdetail.css";

export default function PaymentReturn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pidx = searchParams.get("pidx");
  const urlStatus = searchParams.get("status");

  const [state, setState] = useState({
    loading: true,
    kind: "pending",
    status: urlStatus || "Pending",
    message: "Verifying your payment…",
  });

  useEffect(() => {
    if (!pidx) {
      setState({
        loading: false,
        kind: "failed",
        status: "failed",
        message: "No payment reference found.",
      });
      return;
    }

    let done = false;
    confirmKhaltiPayment(pidx)
      .then((res) => {
        if (done) return;
        if (res && res.confirmed) {
          setState({ loading: false, kind: "success", status: "Completed", message: "Payment received! You're registered for this event." });
          return;
        }
        const s = res?.status || urlStatus || "Pending";
        // Khalti statuses: Completed (success); Pending/Initiated (in progress);
        // User canceled/Expired/Failed (failure).
        const pending = s === "Pending" || s === "Initiated" || s === "Partially refunded";
        const canceled = s === "User canceled" || s === "Canceled";
        const kind = pending ? "pending" : "failed";
        const msg = pending
          ? "Your payment is still being processed. We'll confirm once it completes."
          : canceled
          ? "Payment was cancelled. Your registration was not completed."
          : s === "Expired"
          ? "This payment link has expired. Please try registering again."
          : "Payment could not be completed. Please try again.";
        setState({ loading: false, kind, status: s, message: msg });
      })
      .catch((err) => {
        if (done) return;
        setState({
          loading: false,
          kind: "failed",
          status: "failed",
          message: err?.message || "Something went wrong verifying your payment.",
        });
      });

    return () => {
      done = true;
    };
  }, [pidx, urlStatus]);

  const goDashboard = () => navigate("/dashboard");
  const goEvent = () => navigate("/event");

  const icon = state.loading ? (
    <Clock size={56} className="pr-icon pr-pending" />
  ) : state.kind === "success" ? (
    <CheckCircle2 size={56} className="pr-icon pr-success" />
  ) : state.kind === "pending" ? (
    <Clock size={56} className="pr-icon pr-pending" />
  ) : (
    <XCircle size={56} className="pr-icon pr-fail" />
  );

  const heading = state.loading
    ? "Verifying your payment"
    : state.kind === "success"
    ? "Payment Successful"
    : state.kind === "pending"
    ? "Payment Still Processing"
    : "Payment Not Completed";

  return (
    <>
      <Navigation />
      <section className="payment-return-wrap">
        <div className={`payment-return-card ${state.loading ? "is-pending" : state.kind === "success" ? "is-success" : state.kind === "pending" ? "is-pending" : "is-fail"}`}>
          {icon}
          <h2>{heading}</h2>
          <p className="pr-status">{state.status}</p>
          <p className="pr-msg">{state.message}</p>
          <div className="pr-actions">
            <button className="pr-btn pr-btn-primary" onClick={goDashboard}>
              Go to Dashboard
            </button>
            <button className="pr-btn" onClick={goEvent}>
              Browse Events
            </button>
          </div>
          <div className="pr-secure">
            <ShieldCheck size={14} /> Secured by Khalti
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
