import { CATEGORY_META } from "../constants";
import { Icons } from "../components/Icons";

export default function HomePage({ setPage }) {
  return (
    <div>
      {/* Hero */}
      <div className="hero">
        <div className="hero-badge">✦ Fresh. Fast. Free Delivery above ₹299</div>
        <h1 className="hero-title">
          Your everyday<br />
          essentials at<br />
          <span>Shop</span>G
        </h1>
        <p className="hero-sub">
          Groceries, spices, personal care &amp; more —<br />
          delivered straight to your door.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => setPage("grocery")}>
            {Icons.arrowRight} Shop Now
          </button>
          <button className="btn-outline" onClick={() => setPage("beauty")}>
            Explore Beauty
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="section">
        <h2 className="section-title">Shop by Category</h2>
        <p className="section-sub">Everything you need, all in one place</p>
        <div className="categories-grid">
          {Object.entries(CATEGORY_META).map(([key, { abbr, label }]) => (
            <div
              key={key}
              className="category-card"
              onClick={() => setPage(key)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setPage(key)}
            >
              <div className="cat-abbr">{abbr}</div>
              <div className="cat-name">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
