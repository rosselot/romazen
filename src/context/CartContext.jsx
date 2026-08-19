import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getCartTotal,
  CART_VERSION,
  MAX_ITEM_QUANTITY,
  readStoredCart,
  sanitizeCartItems,
  serializeCart,
} from '../utils/cart';

const CartContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => readStoredCart(localStorage));
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('romazen_cart', serializeCart(items));
  }, [items]);

  const addItem = (product) => {
    const [safeProduct] = sanitizeCartItems({
      version: CART_VERSION,
      items: [{ ...product, quantity: 1 }],
    });
    if (!safeProduct || product.inStock === false) return;

    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === safeProduct.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === safeProduct.id
            ? { ...item, quantity: Math.min(item.quantity + 1, MAX_ITEM_QUANTITY) }
            : item
        );
      }
      return [...prevItems, safeProduct];
    });
    setIsDrawerOpen(true);
  };

  const addItems = (products) => {
    const safeProducts = sanitizeCartItems({
      version: CART_VERSION,
      items: products
        .filter((product) => product.inStock !== false)
        .map((product) => ({ ...product, quantity: 1 })),
    });

    if (safeProducts.length === 0) return;

    setItems((prevItems) => safeProducts.reduce((nextItems, product) => {
      const existing = nextItems.find((item) => item.id === product.id);
      if (existing) {
        return nextItems.map((item) => (
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, MAX_ITEM_QUANTITY) }
            : item
        ));
      }
      return [...nextItems, product];
    }, prevItems));
    setIsDrawerOpen(true);
  };

  const removeItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (!Number.isInteger(quantity) || quantity < 1) {
      removeItem(id);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => (
        item.id === id ? { ...item, quantity: Math.min(quantity, MAX_ITEM_QUANTITY) } : item
      ))
    );
  };

  const clearCart = React.useCallback(() => {
    setItems([]);
  }, []);

  const cartTotal = getCartTotal(items);

  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        addItems,
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
