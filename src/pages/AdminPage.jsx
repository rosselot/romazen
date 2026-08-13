import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { normalizeCandleRecord } from '../data/candlePrices';
import Layout from '../components/Layout/Layout';
import Button from '../components/UI/Button';
import { useOverlayA11y } from '../hooks/useOverlayA11y';
import { usePageMeta } from '../hooks/usePageMeta';
import styles from './AdminPage.module.css';

const AdminPage = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(null);
  
  const [candles, setCandles] = useState([]);
  const [fetchingProducts, setFetchingProducts] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [catalogError, setCatalogError] = useState('');
  const [mutationMessage, setMutationMessage] = useState('');
  
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const modalRef = React.useRef(null);
  const closeButtonRef = React.useRef(null);

  usePageMeta({
    title: 'Inventory Admin | Romazen',
    description: 'Private Romazen inventory administration.',
    noIndex: true,
  });

  const fetchProducts = React.useCallback(async () => {
    if (!supabase) return;

    setFetchingProducts(true);
    setCatalogError('');
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');

    if (error) {
      console.error('Admin catalog request failed', { code: error.code });
      setCatalogError(error.status === 401 || error.status === 403
        ? 'Your account does not have permission to read the catalog.'
        : 'The catalog could not be reached. Check the Supabase project and try again.');
    } else {
      const parsedCandles = (data || []).map((record) => normalizeCandleRecord(record)).filter(Boolean);
      setCandles(parsedCandles);
    }
    setFetchingProducts(false);
  }, []);

  useEffect(() => {
    if (!supabase) return undefined;

    let ignore = false;

    supabase.auth.getSession().then(({ data: { session: currentSession }, error }) => {
      if (ignore) return;
      if (error) setAuthError('Authentication is unavailable. Check the Supabase configuration.');
      setSession(currentSession);
      setLoading(false);
      if (currentSession) void fetchProducts();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) void fetchProducts();
      else setCandles([]);
    });

    return () => {
      ignore = true;
      subscription.unsubscribe();
    };
  }, [fetchProducts]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(error.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const toggleStock = async (candle) => {
    setUpdatingId(candle.id);
    setMutationMessage('');
    const newStockStatus = !candle.inStock;
    
    const { error } = await supabase
      .from('products')
      .update({ inStock: newStockStatus })
      .eq('id', candle.id);

    if (error) {
      console.error('Admin stock update failed', { code: error.code });
      setMutationMessage(`Could not update ${candle.name}. Nothing changed; please try again.`);
    } else {
      setCandles((prevCandles) =>
        prevCandles.map((c) =>
          c.id === candle.id ? { ...c, inStock: newStockStatus } : c
        )
      );
      setMutationMessage(`${candle.name} is now ${newStockStatus ? 'in stock' : 'sold out'}.`);
    }
    setUpdatingId(null);
  };

  const handleEditClick = (candle) => {
    setEditingProduct(candle);
    setEditForm({
      name: candle.name || '',
      price: candle.price || '',
      size: candle.size || '',
      burnTime: candle.burnTime || '',
      notes: candle.notes || '',
      details: candle.details || '',
      image: candle.image || '',
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClose = React.useCallback(() => {
    setEditingProduct(null);
    setEditForm(null);
  }, []);

  useOverlayA11y({
    isOpen: Boolean(editingProduct),
    containerRef: modalRef,
    initialFocusRef: closeButtonRef,
    onClose: handleEditClose,
  });

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    setSavingEdit(true);
    setMutationMessage('');

    const updates = {
      name: editForm.name,
      price: editForm.price,
      size: editForm.size,
      burnTime: editForm.burnTime,
      notes: editForm.notes,
      details: editForm.details,
      image: editForm.image,
    };

    const { error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', editingProduct.id);

    if (error) {
      console.error('Admin product edit failed', { code: error.code });
      setMutationMessage('Changes were not saved. Check your connection and permissions, then try again.');
    } else {
      setCandles((prevCandles) =>
        prevCandles.map((c) =>
          c.id === editingProduct.id
            ? { ...c, ...editForm }
            : c
        )
      );
      setMutationMessage(`${editForm.name} was saved.`);
      handleEditClose();
    }
    setSavingEdit(false);
  };

  if (!supabase) {
    return (
      <Layout>
        <div className={styles.loginContainer}>
          <div className={styles.loginCard} role="alert">
            <h1 className={styles.title}>Admin configuration needed</h1>
            <p className={styles.subtitle}>
              The catalog service is not configured. Add the approved Supabase URL and public key before inventory can be managed.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading && !session) {
    return (
      <Layout>
        <div className={styles.loadingContainer}>
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!session) {
    return (
      <Layout>
        <div className={styles.loginContainer}>
           <div className={styles.loginCard}>
             <h1 className={styles.title}>Admin Login</h1>
             <p className={styles.subtitle}>Enter your credentials to manage shop inventory.</p>
             
             <form onSubmit={handleLogin} className={styles.form}>
                {authError && <div className={styles.errorBanner} role="alert">{authError}</div>}
                
                <div className={styles.inputGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={styles.input}
                    placeholder="hello@romazen.com"
                    autoComplete="username"
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={styles.input}
                    autoComplete="current-password"
                  />
                </div>
                
                <Button type="submit" variant="primary" disabled={loading} style={{ width: '100%' }}>
                  {loading ? 'Logging in...' : 'Log In'}
                </Button>
             </form>
           </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className={styles.adminPage}>
        <div className="container">
          <div className={styles.headerRow}>
            <div>
              <span className={styles.eyebrow}>Dashboard</span>
              <h1 className={styles.pageTitle}>Inventory Management</h1>
              <p className={styles.pageSubtitle}>Manage your current product availability.</p>
            </div>
            <Button variant="secondary" onClick={handleLogout}>Log Out</Button>
          </div>

          {catalogError && (
            <div className={styles.errorBanner} role="alert">
              {catalogError} <button type="button" className={styles.retryButton} onClick={fetchProducts}>Retry</button>
            </div>
          )}
          {mutationMessage && (
            <p className={mutationMessage.includes('not') || mutationMessage.includes('Could not') ? styles.errorBanner : styles.successBanner} role="status" aria-live="polite">
              {mutationMessage}
            </p>
          )}

          {fetchingProducts ? (
            <div className={styles.loadingContainer}>
              <p>Loading products...</p>
            </div>
          ) : (
            <div className={styles.productList}>
              {candles.map((candle) => (
                <div key={candle.id} className={styles.productRow}>
                  <div className={styles.productInfo}>
                    {candle.image && (
                      <img 
                        src={candle.image} 
                        alt={candle.name} 
                        className={styles.productImage} 
                        loading="lazy"
                      />
                    )}
                    <div>
                      <h2 className={styles.productName}>{candle.name}</h2>
                      <p className={styles.productMeta}>{candle.size} • {candle.price}</p>
                    </div>
                  </div>
                  
                  <div className={styles.productActions}>
                     <span className={`${styles.statusBadge} ${candle.inStock ? styles.statusInStock : styles.statusSoldOut}`}>
                       {candle.inStock ? 'In Stock' : 'Sold Out'}
                     </span>
                     <Button
                       variant="outlineDark"
                       onClick={() => handleEditClick(candle)}
                     >
                       Edit Details
                     </Button>
                     <Button
                       variant={candle.inStock ? 'outlineDark' : 'dark'}
                       onClick={() => toggleStock(candle)}
                       disabled={updatingId === candle.id}
                     >
                       {(() => {
                         if (updatingId === candle.id) return 'Updating...';
                         return candle.inStock ? 'Mark Sold Out' : 'Mark In Stock';
                       })()}
                     </Button>
                  </div>
                </div>
              ))}
              
              {candles.length === 0 && (
                <div className={styles.emptyState}>
                  <p>No products found in the database.</p>
                </div>
              )}
            </div>
          )}

          {editingProduct && editForm && (
            <div className={styles.modalOverlay} onClick={handleEditClose}>
              <div 
                ref={modalRef}
                className={styles.modalCard} 
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-product-title"
                tabIndex={-1}
              >
                <div className={styles.modalHeader}>
                  <h2 id="edit-product-title" className={styles.modalTitle}>Edit Product</h2>
                  <button ref={closeButtonRef} type="button" className={styles.closeButton} onClick={handleEditClose} aria-label="Close product editor">
                    &times;
                  </button>
                </div>
                
                <div className={styles.modalScroll}>
                  <form id="editProductForm" className={styles.modalForm} onSubmit={handleEditSubmit}>
                    
                    <p className={styles.formHelpText}>
                      Update the details below. Changes will immediately reflect on the public pricing page.
                    </p>

                    <div className={styles.formSection}>
                      <h3 className={styles.sectionTitle}>Main Details</h3>
                      <div className={styles.formRow}>
                        <div className={styles.inputGroup}>
                          <label htmlFor="edit-name">Product Name</label>
                          <input
                            id="edit-name"
                            name="name"
                            type="text"
                            value={editForm.name}
                            onChange={handleEditChange}
                            required
                            className={styles.input}
                          />
                        </div>
                        
                        <div className={styles.inputGroup}>
                          <label htmlFor="edit-price">Retail Price</label>
                          <input
                            id="edit-price"
                            name="price"
                            type="text"
                            value={editForm.price}
                            onChange={handleEditChange}
                            required
                            className={styles.input}
                            placeholder='e.g. "$45.00"'
                          />
                        </div>
                      </div>

                      <div className={styles.formRow}>
                        <div className={styles.inputGroup}>
                          <label htmlFor="edit-size">Size Format</label>
                          <input
                            id="edit-size"
                            name="size"
                            type="text"
                            value={editForm.size}
                            onChange={handleEditChange}
                            className={styles.input}
                            placeholder='e.g. "8 oz"'
                          />
                        </div>
                        
                        <div className={styles.inputGroup}>
                          <label htmlFor="edit-burnTime">Est. Burn Time</label>
                          <input
                            id="edit-burnTime"
                            name="burnTime"
                            type="text"
                            value={editForm.burnTime}
                            onChange={handleEditChange}
                            className={styles.input}
                            placeholder='e.g. "45-50 hrs"'
                          />
                        </div>
                      </div>
                    </div>

                    <div className={styles.formSection}>
                      <h3 className={styles.sectionTitle}>Content</h3>
                      <div className={styles.inputGroup}>
                        <label htmlFor="edit-notes">Scent Profile (Notes)</label>
                        <input
                          id="edit-notes"
                          name="notes"
                          type="text"
                          value={editForm.notes}
                          onChange={handleEditChange}
                          className={styles.input}
                          placeholder="Top, middle, and base notes..."
                        />
                      </div>

                      <div className={styles.inputGroup}>
                        <label htmlFor="edit-details">Full Description</label>
                        <textarea
                          id="edit-details"
                          name="details"
                          value={editForm.details}
                          onChange={handleEditChange}
                          className={styles.textarea}
                          rows={3}
                        />
                      </div>

                      <div className={styles.inputGroup}>
                        <label htmlFor="edit-image">Reference Image URL</label>
                        <input
                          id="edit-image"
                          name="image"
                          type="text"
                          value={editForm.image}
                          onChange={handleEditChange}
                          className={styles.input}
                        />
                      </div>
                    </div>
                  </form>
                </div>

                <div className={styles.modalActions}>
                  <Button type="button" variant="outlineDark" onClick={handleEditClose} disabled={savingEdit}>
                    Cancel
                  </Button>
                  <Button type="submit" form="editProductForm" variant="dark" disabled={savingEdit}>
                    {savingEdit ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>
    </Layout>
  );
};

export default AdminPage;
