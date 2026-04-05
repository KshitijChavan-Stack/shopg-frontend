import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Toast, useToast, Spinner } from "../components/Toast";
import { Icons } from "../components/Icons";
import { CATEGORY_META } from "../constants";
import { API } from "../config";

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];

function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(
    product || { name: "", price: "", category: "grocery", image: "", description: "" }
  );
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) return;
    setSaving(true);
    await onSave({ ...form, price: Number(form.price) });
    setSaving(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">{product ? "Edit Product" : "Add Product"}</div>

        <div className="form-group">
          <label className="form-label">Product Name</label>
          <input className="form-input" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Parle-G" />
        </div>
        <div className="form-group">
          <label className="form-label">Price (₹)</label>
          <input className="form-input" type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="0" />
        </div>
        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-input" value={form.category} onChange={(e) => set("category", e.target.value)}>
            {Object.entries(CATEGORY_META).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Cloudinary Image URL</label>
          <input className="form-input" value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://res.cloudinary.com/…" />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <input className="form-input" value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Short description" />
        </div>

        {form.image && (
          <img src={form.image} alt="preview" style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8, marginBottom: 16 }} onError={(e) => e.target.style.display = "none"} />
        )}

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderStatusModal({ order, onClose, onSave, token }) {
  const [status, setStatus] = useState(order.status);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(order._id, status);
    setSaving(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Update Order Status</div>
        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
          Order #{order._id.slice(-8).toUpperCase()}
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage({ setPage }) {
  const { user, token } = useAuth();
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productModal, setProductModal] = useState(null); // null | "new" | product obj
  const [orderModal, setOrderModal] = useState(null);
  const { toast, show, hide } = useToast();

  const authH = useMemo(() => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  }), [token]);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    fetch(`${API}/products?limit=100`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setProducts(d.products); })
      .finally(() => setLoading(false));
  }, []);

  const fetchOrders = useCallback(() => {
    fetch(`${API}/orders`, { headers: authH })
      .then((r) => r.json())
      .then((d) => { if (d.success) setOrders(d.orders); });
  }, [authH]);

  useEffect(() => { fetchProducts(); fetchOrders(); }, [fetchProducts, fetchOrders]);

  const saveProduct = async (form) => {
    const isEdit = productModal && productModal._id;
    const url = isEdit ? `${API}/products/${productModal._id}` : `${API}/products`;
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: authH, body: JSON.stringify(form) });
    const data = await res.json();
    if (data.success) {
      show(isEdit ? "Product updated!" : "Product created!", "success");
      setProductModal(null);
      fetchProducts();
    } else {
      show(data.message || "Error saving product", "error");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    const res = await fetch(`${API}/products/${id}`, { method: "DELETE", headers: authH });
    const data = await res.json();
    if (data.success) { show("Product deleted", "success"); fetchProducts(); }
    else show(data.message || "Error", "error");
  };

  const updateOrderStatus = async (orderId, status) => {
    const res = await fetch(`${API}/orders/${orderId}/status`, {
      method: "PATCH",
      headers: authH,
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) { show("Status updated!", "success"); setOrderModal(null); fetchOrders(); }
    else show(data.message || "Error", "error");
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="admin-wrap">
        <div className="state-center">
          <div className="state-icon">{Icons.admin}</div>
          <div className="state-title">Admin Access Only</div>
          <p className="state-sub">You don't have permission to view this page</p>
          <button className="btn-primary" onClick={() => setPage("home")}>Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-wrap">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={hide} />}
      {productModal !== null && (
        <ProductModal
          product={productModal === "new" ? null : productModal}
          onClose={() => setProductModal(null)}
          onSave={saveProduct}
        />
      )}
      {orderModal && (
        <OrderStatusModal
          order={orderModal}
          onClose={() => setOrderModal(null)}
          onSave={updateOrderStatus}
          token={token}
        />
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: 12 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Admin Panel</h1>
        <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
          Logged in as <strong>{user.username}</strong>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button className={`admin-tab ${tab === "products" ? "active" : ""}`} onClick={() => setTab("products")}>
          Products ({products.length})
        </button>
        <button className={`admin-tab ${tab === "orders" ? "active" : ""}`} onClick={() => setTab("orders")}>
          Orders ({orders.length})
        </button>
      </div>

      {/* Products Tab */}
      {tab === "products" && (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
            <button className="btn-primary" style={{ gap: 8 }} onClick={() => setProductModal("new")}>
              {Icons.plus} Add Product
            </button>
          </div>

          {loading ? <Spinner /> : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <div className="admin-img-thumb">
                          {p.image ? (
                            <img src={p.image} alt={p.name} onError={(e) => e.target.style.display = "none"} />
                          ) : (
                            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-light)" }}>
                              {CATEGORY_META[p.category]?.abbr || "IMG"}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ fontWeight: 500 }}>{p.name}</td>
                      <td style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                        {CATEGORY_META[p.category]?.label || p.category}
                      </td>
                      <td style={{ fontWeight: 600 }}>₹{p.price}</td>
                      <td>
                        <span style={{
                          padding: "2px 8px", borderRadius: 40, fontSize: "0.72rem", fontWeight: 600,
                          background: p.inStock ? "#dcfce7" : "#fee2e2",
                          color: p.inStock ? "#16a34a" : "#dc2626",
                        }}>
                          {p.inStock ? "In Stock" : "Out"}
                        </span>
                      </td>
                      <td>
                        <div className="icon-btn-row">
                          <button className="icon-btn" onClick={() => setProductModal(p)} title="Edit">
                            {Icons.edit}
                          </button>
                          <button className="icon-btn danger" onClick={() => deleteProduct(p._id)} title="Delete">
                            {Icons.trash}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Orders Tab */}
      {tab === "orders" && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>
                    #{o._id.slice(-8).toUpperCase()}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: "0.875rem" }}>{o.customerName}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{o.contact}</div>
                  </td>
                  <td style={{ fontSize: "0.82rem", color: "var(--text-muted)", maxWidth: 180 }}>
                    {o.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                  </td>
                  <td style={{ fontWeight: 700 }}>₹{o.totalAmount}</td>
                  <td><span className={`order-status status-${o.status}`}>{o.status}</span></td>
                  <td style={{ fontSize: "0.78rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                    {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td>
                    <button className="icon-btn" onClick={() => setOrderModal(o)} title="Update Status">
                      {Icons.edit}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
