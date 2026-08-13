import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Button from '../components/UI/Button';
import { useCart } from '../context/CartContext';
import { usePageMeta } from '../hooks/usePageMeta';
import styles from './PageTemplates.module.css';

const CheckoutOutcome = ({ cancelled = false }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [state, setState] = React.useState(cancelled ? 'cancelled' : 'loading');
  const [message, setMessage] = React.useState('Verifying your payment securely…');
  const [reference, setReference] = React.useState('');
  const sessionId = searchParams.get('session_id') || '';

  usePageMeta({
    title: cancelled ? 'Checkout Cancelled | Romazen' : 'Order Confirmation | Romazen',
    description: cancelled
      ? 'Your Romazen checkout was cancelled and your cart has been preserved.'
      : 'Verify the outcome of your Romazen checkout.',
    noIndex: true,
  });

  React.useEffect(() => {
    if (cancelled) return undefined;

    if (!sessionId) {
      setState('error');
      setMessage('This confirmation link is incomplete. No paid order has been confirmed.');
      return undefined;
    }

    const controller = new AbortController();

    fetch(`/api/verify-checkout-session?session_id=${encodeURIComponent(sessionId)}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.verified) throw new Error(result.message || 'Payment could not be verified.');

        const completionKey = `romazen_checkout_${sessionId}`;
        if (!localStorage.getItem(completionKey)) {
          clearCart();
          localStorage.setItem(completionKey, 'complete');
        }

        setReference(result.reference || 'Confirmed');
        setState('success');
        setMessage('Payment confirmed. Thank you for choosing Romazen.');
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setState('error');
        setMessage(error.message || 'We could not verify this checkout.');
      });

    return () => controller.abort();
  }, [cancelled, clearCart, sessionId]);

  const title = state === 'success'
    ? 'Your order is confirmed'
    : state === 'cancelled'
      ? 'Checkout cancelled'
      : state === 'error'
        ? 'Confirmation unavailable'
        : 'Verifying your order';

  return (
    <Layout>
      <section className={styles.page}>
        <div className="container">
          <div className={styles.inner} aria-live="polite" aria-busy={state === 'loading'}>
            <span className={styles.eyebrow}>Checkout</span>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.text}>{cancelled ? 'No payment was completed. Your cart is still waiting for you.' : message}</p>
            {state === 'success' && (
              <div className={styles.richText}>
                <p>Order reference: <strong>{reference}</strong></p>
                <p>Standard delivery is expected within 3–5 business days after fulfillment begins.</p>
                <p>Questions? Email <a href="mailto:hello@romazen.com">hello@romazen.com</a>.</p>
              </div>
            )}
            <div className={styles.actions}>
              <Button variant="dark" onClick={() => navigate('/shop')}>Continue Shopping</Button>
              {(cancelled || state === 'error') && (
                <Button variant="outlineDark" onClick={() => navigate('/')}>Return Home</Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CheckoutOutcome;
