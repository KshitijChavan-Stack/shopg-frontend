import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("shopg_cart");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const total = cart.reduce((sum, i) => sum + i.item_price * i.quantity, 0);

  useEffect(() => {
    localStorage.setItem("shopg_cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (product_id, item_name, item_price, category = "general") => {
    setCart(prev => {
      if (prev.find(i => i.item_name === item_name)) return prev;
      return [...prev, { product: product_id, item_name, item_price: Number(item_price), quantity: 1, category }];
    });
    return { success: true };
  };

  const removeItem = (item_name) => {
    setCart(prev => prev.filter(i => i.item_name !== item_name));
    return { success: true };
  };

  const updateQty = (item_name, quantity) => {
    const qty = Math.min(Math.max(Number(quantity), 1), 10);
    setCart(prev => prev.map(i => i.item_name === item_name ? { ...i, quantity: qty } : i));
    return { success: true };
  };

  const clearCart = () => { setCart([]); return { success: true }; };

  return (
    <CartContext.Provider value={{ cart, total, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
