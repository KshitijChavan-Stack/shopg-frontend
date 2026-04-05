import { useState, useEffect } from "react";

export function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  if (!msg) return null;
  return <div className={`toast toast-${type}`}>{msg}</div>;
}

export function useToast() {
  const [toast, setToast] = useState(null);
  const show = (msg, type = "success") => setToast({ msg, type });
  const hide = () => setToast(null);
  return { toast, show, hide };
}

export function Spinner() {
  return (
    <div className="loading-wrap">
      <div className="spinner" />
      <p>Loading…</p>
    </div>
  );
}
