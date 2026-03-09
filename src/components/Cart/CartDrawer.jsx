import React from 'react';
import { useCart } from '../../context/CartContext';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../UI/Button';
import { useOverlayA11y } from '../../hooks/useOverlayA11y';
import styles from './CartDrawer.module.css';

// Replace string price with a number to calculate total
const parsePrice = (priceStr) => Number.parseFloat(priceStr.replaceAll(/[^0-9.]/g, ''));

const CartDrawer = () => {
  const { items, isDrawerOpen, setIsDrawerOpen, updateQuantity, removeItem, cartTotal } = useCart();
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const drawerRef = React.useRef(null);
  const closeButtonRef = React.useRef(null);
  const closeDrawer = React.useCallback(() => setIsDrawerOpen(false), [setIsDrawerOpen]);

  useOverlayA11y({
    isOpen: isDrawerOpen,
    containerRef: drawerRef,
    initialFocusRef: closeButtonRef,
    onClose: closeDrawer,
  });

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsCheckingOut(true);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const session = await response.json();
      
      // Redirect to Stripe Checkout page
      if (session.url) {
        globalThis.location.href = session.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('There was an issue initiating checkout. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
          />
          <motion.div
            ref={drawerRef}
            className={styles.drawer}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            tabIndex={-1}
          >
            <div className={styles.header}>
              <h2 id="cart-drawer-title">Your Cart</h2>
              <button
                ref={closeButtonRef}
                className={styles.closeButton}
                onClick={closeDrawer}
                aria-label="Close cart"
              >
                <X size={24} />
              </button>
            </div>

            <div className={styles.itemsContainer}>
              {items.length === 0 ? (
                <div className={styles.emptyState}>
                  <ShoppingBag size={48} />
                  <p>Your cart is empty</p>
                  <Button variant="secondary" onClick={closeDrawer}>
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <ul className={styles.itemList}>
                  {items.map((item) => (
                    <li key={item.id} className={styles.item}>
                      <img src={item.image} alt={item.name} className={styles.itemImage} />
                      <div className={styles.itemDetails}>
                        <div className={styles.itemHeader}>
                          <h3>{item.name}</h3>
                          <button
                            className={styles.removeButton}
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <p className={styles.itemMeta}>{item.size || item.category}</p>
                        <div className={styles.itemOptions}>
                          <div className={styles.quantityControls}>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className={styles.itemPrice}>
                            ${(parsePrice(item.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <p className={styles.taxNotice}>Taxes and shipping calculated at checkout</p>
                <Button 
                  variant="primary" 
                  onClick={handleCheckout} 
                  disabled={isCheckingOut}
                  className={styles.checkoutButton}
                >
                  {isCheckingOut ? 'Loading...' : 'Checkout'}
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
