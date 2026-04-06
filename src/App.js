import { useState, useCallback } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider, useCart } from "./contexts/CartContext";
import { CATEGORY_META } from "./constants";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import { CartDrawer } from "./components/CartDrawer";
import { ProductDetailModal } from "./components/ProductDetailModal";
import "./index.css";

function AppInner() {
  const [page, setPage] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addItem, cart } = useCart();

  const handleSearch = (q) => {
    setSearchQuery(q);
    if (q) setPage("search");
  };

  const handleSetPage = (p) => {
    setPage(p);
    setSearchQuery("");
  };

  const openProduct = useCallback((p) => {
    setSelectedProduct(p);
  }, []);

  const handleAddToCart = (p) => {
    addItem(p._id, p.name, p.price, p.category);
    setCartDrawerOpen(true); // Open drawer on add
  };

  const renderPage = () => {
    const commonProps = { setPage: handleSetPage, onProductClick: openProduct };
    
    if (page === "home") return <HomePage {...commonProps} />;
    if (page === "cart") return <CartPage {...commonProps} />;
    if (page === "login") return <AuthPage {...commonProps} />;
    if (page === "admin-login") return <AuthPage {...commonProps} isAdminMode={true} />;
    if (page === "orders") return <OrdersPage {...commonProps} />;
    if (page === "admin") return <AdminPage {...commonProps} />;
    if (page === "search") return (
      <ProductsPage category="" searchQuery={searchQuery} {...commonProps} />
    );
    if (Object.keys(CATEGORY_META).includes(page)) return (
      <ProductsPage category={page} searchQuery="" {...commonProps} />
    );
    return <HomePage {...commonProps} />;
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar 
        page={page} 
        setPage={handleSetPage} 
        onSearch={handleSearch} 
        onCartClick={() => setCartDrawerOpen(true)} 
      />
      
      <main style={{ flex: 1 }}>
        {renderPage()}
      </main>

      <Footer setPage={handleSetPage} />

      <CartDrawer 
        isOpen={cartDrawerOpen} 
        onClose={() => setCartDrawerOpen(false)} 
        onCheckout={() => { setCartDrawerOpen(false); setPage("cart"); }}
      />

      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)}
          onAdd={handleAddToCart}
          inCart={cart.some(i => i.item_name === selectedProduct.name)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppInner />
      </CartProvider>
    </AuthProvider>
  );
}
