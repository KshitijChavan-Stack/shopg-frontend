import { useState } from "react";
import { CATEGORY_META } from "../constants";
import { useAuth } from "../contexts/AuthContext";

export function ProductCard({ product, onAdd, inCart, onClick }) {
  const meta = CATEGORY_META[product.category] || {};
  const [imgErr, setImgErr] = useState(false);
  const { user } = useAuth();

  return (
    <div className="product-card" onClick={() => onClick && onClick(product)}>
      <div className="product-img-wrap">
        {product.image && !imgErr ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgErr(true)}
          />
        ) : (
          <span className="product-img-placeholder">{meta.abbr || "IMG"}</span>
        )}
      </div>
      <div className="product-info">
        <div className="product-cat">{meta.label || product.category}</div>
        <div className="product-name">{product.name}</div>
        <div className="product-price">₹{product.price}</div>
        
        <div style={{ 
          fontSize: '0.7rem', 
          fontWeight: 700, 
          marginBottom: 8,
          color: product.stock > 0 ? (product.stock < 10 ? '#d97706' : '#16a34a') : '#dc2626'
        }}>
          {product.stock > 0 ? (product.stock < 10 ? `Only ${product.stock} Left` : 'In Stock') : 'Out of Stock'}
        </div>

        {user?.role !== "admin" && (
          <button
            className={`add-btn ${inCart ? "in-cart" : ""} ${product.stock === 0 ? "out-of-stock" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              !inCart && product.stock > 0 && onAdd(product);
            }}
            disabled={inCart || product.stock === 0}
          >
            {product.stock === 0 ? "Out of Stock" : (inCart ? "In Cart" : "Add to Cart")}
          </button>
        )}
      </div>
    </div>
  );
}
