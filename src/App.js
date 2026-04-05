import { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { CATEGORY_META } from "./constants";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import "./index.css";

function AppInner() {
  const [page, setPage] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (q) => {
    setSearchQuery(q);
    if (q) setPage("search");
  };

  const handleSetPage = (p) => {
    setPage(p);
    setSearchQuery("");
  };

  const renderPage = () => {
    if (page === "home") return <HomePage setPage={handleSetPage} />;
    if (page === "cart") return <CartPage setPage={handleSetPage} />;
    if (page === "login") return <AuthPage setPage={handleSetPage} />;
    if (page === "admin-login") return <AuthPage setPage={handleSetPage} isAdminMode={true} />;
    if (page === "orders") return <OrdersPage setPage={handleSetPage} />;
    if (page === "admin") return <AdminPage setPage={handleSetPage} />;
    if (page === "search") return (
      <ProductsPage category="" searchQuery={searchQuery} setPage={handleSetPage} />
    );
    if (Object.keys(CATEGORY_META).includes(page)) return (
      <ProductsPage category={page} searchQuery="" setPage={handleSetPage} />
    );
    return <HomePage setPage={handleSetPage} />;
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar page={page} setPage={handleSetPage} onSearch={handleSearch} />
      <main style={{ flex: 1 }}>
        {renderPage()}
      </main>
      <Footer setPage={handleSetPage} />
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
