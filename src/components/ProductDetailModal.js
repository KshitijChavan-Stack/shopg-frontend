import { Icons } from "./Icons";
import { CATEGORY_META } from "../constants";

export function ProductDetailModal({ product, onClose, onAdd, inCart }) {
  if (!product) return null;
  const meta = CATEGORY_META[product.category] || {};

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="qv-close" onClick={onClose}>{Icons.close}</button>
        
        <div className="qv-img-side">
          {product.image ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <div className="product-img-placeholder" style={{ fontSize: "2rem" }}>
              {meta.abbr || "IMG"}
            </div>
          )}
        </div>

        <div className="qv-info-side">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
            <div className="product-cat">{meta.label || product.category}</div>
            {product.brand && (
              <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--brand-primary)", letterSpacing: 0.5 }}>
                {product.brand}
              </div>
            )}
          </div>
          <h2 className="section-title" style={{ fontSize: "2rem", marginBottom: 8 }}>{product.name}</h2>
          <div className="product-price" style={{ fontSize: "1.5rem" }}>₹{product.price}</div>
          
          <p className="section-sub" style={{ margin: "1rem 0" }}>
            {product.description || "High-quality essential product curated by ShopG for your daily needs."}
          </p>

          <button
            className={`btn-primary ${inCart ? "in-cart" : ""}`}
            style={{ width: "100%", marginTop: "auto", padding: "16px" }}
            onClick={() => !inCart && onAdd(product)}
            disabled={inCart}
          >
            {inCart ? "Already in Cart" : `Add to Cart • ₹${product.price}`}
          </button>
          
          <div style={{ display: "flex", gap: "12px", marginTop: "1rem" }}>
            <div className="hero-badge" style={{ margin: 0 }}>✦ Free Delivery</div>
            <div className="hero-badge" style={{ margin: 0 }}>✓ Quality Assured</div>
          </div>
        </div>
      </div>
    </div>
  );
}
