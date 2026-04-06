import { useState } from "react";
import { CATEGORY_META } from "../constants";

export function ProductCard({ product, onAdd, inCart, onClick }) {
  const meta = CATEGORY_META[product.category] || {};
  const [imgErr, setImgErr] = useState(false);

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
        <button
          className={`add-btn ${inCart ? "in-cart" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            !inCart && onAdd(product);
          }}
          disabled={inCart}
        >
          {inCart ? "In Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
