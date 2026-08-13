import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../UI/Button';
import { useOverlayA11y } from '../../hooks/useOverlayA11y';
import styles from './CartDrawer.module.css';
import ResponsiveImage from '../UI/ResponsiveImage';
import { FREE_SHIPPING_THRESHOLD, getBundleDiscountRate } from '../../data/commerce';

// Replace string price with a number to calculate total
const parsePrice = (priceStr) => Number.parseFloat(priceStr.replaceAll(/[^0-9.]/g, ''));

const CartDrawer = () => {
  const { items, isDrawerOpen, setIsDrawerOpen, updateQuantity, removeItem, cartTotal, cartCount } = useCart();
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const [checkoutError, setCheckoutError] = React.useState('');
  const drawerRef = React.useRef(null);
  const closeButtonRef = React.useRef(null);
  const closeDrawer = React.useCallback(() => setIsDrawerOpen(false), [setIsDrawerOpen]);
  const bundleDiscountRate = getBundleDiscountRate(cartCount);
  const bundleSavings = cartTotal * bundleDiscountRate;
  const orderSubtotal = cartTotal - bundleSavings;
  const shippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - orderSubtotal);
  const shippingProgress = Math.min(100, (orderSubtotal / FREE_SHIPPING_THRESHOLD) * 100);

  useOverlayA11y({
    isOpen: isDrawerOpen,
    containerRef: drawerRef,
    initialFocusRef: closeButtonRef,
    onClose: closeDrawer,
  });

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsCheckingOut(true);
    setCheckoutError('');

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      const session = await response.json().catch(() => ({}));
      if (!response.ok) {
        const reference = session.requestId ? ` Reference: ${session.requestId.slice(0, 8)}.` : '';
        setCheckoutError(`${session.message || 'Checkout could not be started. Please try again.'}${reference}`);
        return;
      }
      
      // Redirect to Stripe Checkout page
      if (session.url) {
        globalThis.location.href = session.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout request failed', error);
      setCheckoutError('We could not reach checkout. Your cart is saved; please try again.');
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
                      <ResponsiveImage
                        src={item.image}
                        naturalWidth={item.imageWidth}
                        alt=""
                        className={styles.itemImage}
                        loading="lazy"
                        decoding="async"
                        sizes="80px"
                      />
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
                <div className={styles.shippingMeter}>
                  <p>
                    {shippingRemaining === 0
                      ? 'Complimentary standard shipping unlocked.'
                      : `Add $${shippingRemaining.toFixed(2)} for complimentary standard shipping.`}
                  </p>
                  <div
                    className={styles.progressTrack}
                    role="progressbar"
                    aria-label="Progress toward free standard shipping"
                    aria-valuemin="0"
                    aria-valuemax={FREE_SHIPPING_THRESHOLD}
                    aria-valuenow={Math.min(orderSubtotal, FREE_SHIPPING_THRESHOLD)}
                  >
                    <span style={{ width: `${shippingProgress}%` }} />
                  </div>
                </div>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                {bundleSavings > 0 && (
                  <div className={styles.savingsRow}>
                    <span>Set savings ({Math.round(bundleDiscountRate * 100)}%)</span>
                    <span>−${bundleSavings.toFixed(2)}</span>
                  </div>
                )}
                <div className={styles.orderTotalRow}>
                  <span>Order subtotal</span>
                  <strong>${orderSubtotal.toFixed(2)}</strong>
                </div>
                <p className={styles.taxNotice}>
                  {shippingRemaining === 0 ? 'Standard shipping is free. ' : ''}Taxes calculated at checkout.
                </p>
                <p className={styles.policyNotice}>
                  By continuing, you agree to our <Link to="/terms" onClick={closeDrawer}>terms</Link> and acknowledge our <Link to="/privacy" onClick={closeDrawer}>privacy policy</Link>.
                </p>
                <p className={styles.checkoutError} role="alert" aria-live="assertive">
                  {checkoutError}
                </p>
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
