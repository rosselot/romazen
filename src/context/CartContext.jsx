import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    // Load initial cart from localStorage if available
    const saved = localStorage.getItem('romazen_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Persist to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('romazen_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product) => {
    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    setIsDrawerOpen(true);
  };

  const removeItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartTotal = items.reduce((total, item) => {
    // Remove '$' and convert to float
    const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
    return total + price * item.quantity;
  }, 0);

  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isDrawerOpen,
        setIsDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
