import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, XCircle, Info } from "lucide-react";
import "./toast.css";

const ToastContext = createContext(null);

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "success", duration = 3500) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => removeToast(id), duration);
    },
    [removeToast]
  );

  const success = (msg, dur) => showToast(msg, "success", dur);
  const error = (msg, dur) => showToast(msg, "error", dur);
  const info = (msg, dur) => showToast(msg, "info", dur);

  const getIcon = (type) => {
    if (type === "success") return <CheckCircle2 size={20} />;
    if (type === "error") return <XCircle size={20} />;
    return <Info size={20} />;
  };

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span className="toast-icon">{getIcon(t.type)}</span>
            <span className="toast-message">{t.message}</span>
            <button className="toast-close" onClick={() => removeToast(t.id)}>✕</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
