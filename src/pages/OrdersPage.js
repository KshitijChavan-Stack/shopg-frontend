import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Icons } from "../components/Icons";
import { Spinner } from "../components/Toast";
import { API } from "../config";

function StatusBadge({ status }) {
  return <span className={`order-status status-${status}`}>{status}</span>;
}

export default function OrdersPage({ setPage }) {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`${API}/orders/myorders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => { if (d.success) setOrders(d.orders); })
      .finally(() => setLoading(false));
  }, [user, token]);

  if (!user) {
    return (
      <div className="orders-wrap">
        <div className="state-center">
          <div className="state-icon">{Icons.user}</div>
          <div className="state-title">Login Required</div>
          <p className="state-sub">Please login to view your orders</p>
          <button className="btn-primary" onClick={() => setPage("login")}>Login</button>
        </div>
      </div>
    );
  }

  if (loading) return <div className="orders-wrap"><Spinner /></div>;

  if (orders.length === 0) {
    return (
      <div className="orders-wrap">
        <h1 className="page-title">My Orders</h1>
        <div className="state-center">
          <div className="state-icon">{Icons.orders}</div>
          <div className="state-title">No orders yet</div>
          <p className="state-sub">Your placed orders will appear here</p>
          <button className="btn-primary" onClick={() => setPage("home")}>Start Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-wrap">
      <h1 className="page-title">My Orders</h1>
      {orders.map((order) => (
        <div className="order-card" key={order._id}>
          <div className="order-card-header">
            <div>
              <div className="order-id">Order #{order._id.slice(-8).toUpperCase()}</div>
              <div className="order-date">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric",
                })}
              </div>
            </div>
            <StatusBadge status={order.status} />
          </div>

          <div className="order-items-list">
            {order.items.map((item, idx) => (
              <span key={idx}>
                {item.name} × {item.quantity}
                {idx < order.items.length - 1 ? " · " : ""}
              </span>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="order-total">₹{order.totalAmount}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {order.address}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
