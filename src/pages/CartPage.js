import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { Toast, useToast } from "../components/Toast";
import { Icons } from "../components/Icons";
import { CATEGORY_META } from "../constants";
import { API } from "../config";

export default function CartPage({ setPage }) {
  const { cart, total, removeItem, updateQty, clearCart } = useCart();
  const { user, token } = useAuth();
  const [ordered, setOrdered] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast, show, hide } = useToast();

  if (ordered) {
    return (
      <div className="cart-wrap">
        <div className="state-center">
          <div className="state-icon success">{Icons.check}</div>
          <div className="state-title">Order Placed!</div>
          <p className="state-sub">
            Your order has been placed. Pay via <strong>Cash on Delivery</strong> when your order arrives.
          </p>
          <button className="btn-primary" onClick={() => { setOrdered(false); setPage("home"); }}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart-wrap">
        <div className="state-center">
          <div className="state-icon">{Icons.cart}</div>
          <div className="state-title">Your cart is empty</div>
          <p className="state-sub">Add some products to get started</p>
          <button className="btn-primary" onClick={() => setPage("home")}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const handleCheckout = async () => {
    if (!user) {
      show("Login required to checkout", "error");
      setTimeout(() => setPage("login"), 1500);
      return;
    }
    if (!customerName || !address || !contact) {
      show("Please fill in all delivery details", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerName,
          address,
          contact,
          totalAmount: total,
          items: cart.map((i) => ({
            product: i.product,
            name: i.item_name,
            price: i.item_price,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (data.success) { clearCart(); setOrdered(true); }
      else show(data.message || "Failed to place order", "error");
    } catch {
      show("Network error. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cart-wrap">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={hide} />}
      <h1 className="page-title">My Cart</h1>

      <div className="cart-layout">
        {/* Items + Delivery */}
        <div style={{ flex: 1 }}>
          <div className="cart-items">
            {cart.map((item) => {
              const meta = CATEGORY_META[item.category] || {};
              return (
                <div className="cart-item" key={item.item_name}>
                  <div className="cart-item-img">
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-light)" }}>
                      {meta.abbr || "IT"}
                    </span>
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.item_name}</div>
                    <div className="cart-item-price">
                      ₹{item.item_price} × {item.quantity} = <strong>₹{item.item_price * item.quantity}</strong>
                    </div>
                  </div>
                  <div className="qty-control">
                    <button
                      className="qty-btn"
                      onClick={() => updateQty(item.item_name, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >−</button>
                    <span className="qty-num">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQty(item.item_name, item.quantity + 1)}
                      disabled={item.quantity >= 10}
                    >+</button>
                  </div>
                  <button className="remove-btn" onClick={() => removeItem(item.item_name)} title="Remove">
                    {Icons.trash}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Delivery Details */}
          <div className="delivery-form" style={{ marginTop: "1rem" }}>
            <h3>Delivery Details</h3>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" type="text" placeholder="John Doe" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Delivery Address</label>
              <input className="form-input" type="text" placeholder="123 Street, City" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Contact Number</label>
              <input className="form-input" type="tel" placeholder="+91 98765 43210" value={contact} onChange={(e) => setContact(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <div className="summary-title">Order Summary</div>
          {cart.map((item) => (
            <div className="summary-row" key={item.item_name}>
              <span>{item.item_name} × {item.quantity}</span>
              <span>₹{item.item_price * item.quantity}</span>
            </div>
          ))}
          <div className="summary-total">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <div className="payment-section">
            <div className="payment-label">Payment Method</div>
            <div className="payment-opts">
              <div className="payment-opt selected" style={{ cursor: "default" }}>
                <input type="radio" readOnly checked />
                {Icons.cod}
                Cash on Delivery
              </div>
            </div>

            <button className="checkout-btn" onClick={handleCheckout} disabled={submitting}>
              {submitting ? "Placing Order…" : `Place Order — ₹${total}`}
            </button>

            {!user && (
              <p style={{ textAlign: "center", marginTop: "0.75rem", fontSize: "0.8rem", color: "#dc2626" }}>
                Login required to checkout
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className="mobile-cart-bar">
        <div className="mobile-cart-bar-label">
          {Icons.cart} {cart.length} item{cart.length !== 1 ? "s" : ""}
        </div>
        <div className="mobile-cart-bar-price">₹{total}</div>
      </div>
    </div>
  );
}
