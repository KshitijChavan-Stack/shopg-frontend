import { useCart } from "../contexts/CartContext";
import { Icons } from "./Icons";
import { CATEGORY_META } from "../constants";

export function CartDrawer({ isOpen, onClose, onCheckout }) {
  const { cart, total, removeItem, updateQty } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="cart-drawer">
        <div className="drawer-header">
          <div className="drawer-title">Shopping Cart ({cart.length})</div>
          <button className="qv-close" style={{ position: "static" }} onClick={onClose}>
            {Icons.close}
          </button>
        </div>

        <div className="drawer-items">
          {cart.length === 0 ? (
            <div className="state-center" style={{ padding: "2rem 0" }}>
              <div className="state-icon" style={{ width: 48, height: 48 }}>{Icons.cart}</div>
              <p className="state-sub">Your cart is empty</p>
              <button className="btn-outline" onClick={onClose}>Start Shopping</button>
            </div>
          ) : (
            cart.map((item) => {
              const meta = CATEGORY_META[item.category] || {};
              return (
                <div className="cart-item" key={item.item_name} style={{ padding: "0.75rem", borderRadius: "12px" }}>
                  <div className="cart-item-img" style={{ width: 50, height: 50 }}>
                    <span style={{ fontSize: "0.6rem" }}>{meta.abbr || "IT"}</span>
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-name" style={{ fontSize: "0.85rem" }}>{item.item_name}</div>
                    <div className="cart-item-price" style={{ fontSize: "0.75rem" }}>₹{item.item_price}</div>
                  </div>
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => updateQty(item.item_name, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                    <span className="qty-num">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.item_name, item.quantity + 1)} disabled={item.quantity >= 10}>+</button>
                  </div>
                  <button className="remove-btn" onClick={() => removeItem(item.item_name)}>{Icons.trash}</button>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="drawer-footer">
            <div className="summary-row" style={{ border: "none", padding: "0 0 1rem 0" }}>
              <span style={{ fontWeight: 600 }}>Subtotal</span>
              <span style={{ fontWeight: 700, fontSize: "1.25rem" }}>₹{total}</span>
            </div>
            <button className="btn-primary" style={{ width: "100%", padding: "16px" }} onClick={onCheckout}>
              Checkout Now {Icons.arrowRight}
            </button>
            <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "1rem" }}>
              Free delivery on orders above ₹299
            </p>
          </div>
        )}
      </div>
    </>
  );
}
