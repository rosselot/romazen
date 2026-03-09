import React from 'react';
import styles from './SignatureCollection.module.css';
import { PRODUCTS } from '../../data/products';
import { motion } from 'framer-motion';
import Button from '../UI/Button';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const SignatureCollection = ({
    products = PRODUCTS,
    eyebrow = 'Curated Selection',
    heading = 'Signature Collection',
    subheading = 'Explore our most-loved artisanal creations.',
    showFooterCta = true,
    isLoading = false
}) => {
    const navigate = useNavigate();
    const { addItem } = useCart();

    if (isLoading) {
        return (
            <section className={styles.section}>
                <div className="container">
                    <div className={styles.header}>
                        <h2 className={styles.heading}>Loading Catalog...</h2>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <span className={styles.eyebrow}>{eyebrow}</span>
                    <h2 className={styles.heading}>{heading}</h2>
                    <p className={styles.subheading}>{subheading}</p>
                </div>

                <div className={styles.grid}>
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className={styles.productCard}
                        >
                            <div className={styles.imageWrapper}>
                                <img src={product.image} alt={product.name} className={styles.image} />
                                <div className={styles.overlay}>
                                    {!product.inStock && !product.isCandle ? (
                                        <Button variant="primary" disabled>Sold Out</Button>
                                    ) : product.isCandle ? (
                                        <Button variant="primary" onClick={() => navigate('/prices')}>View Pricing</Button>
                                    ) : (
                                        <Button variant="primary" onClick={() => addItem(product)}>Add to Cart</Button>
                                    )}
                                </div>
                            </div>
                            <div className={styles.info}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className={styles.category}>{product.category}</span>
                                    {product.inStock === false && !product.isCandle && (
                                        <span style={{ fontSize: '11px', color: '#7f1d1d', background: '#fee2e2', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sold Out</span>
                                    )}
                                </div>
                                <h3 className={styles.name}>{product.name}</h3>
                                <p className={styles.notes}>{product.notes}</p>
                                <span className={styles.price}>{product.price}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {showFooterCta && (
                    <div className={styles.footer}>
                        <Button variant="secondary" size="large" onClick={() => navigate('/shop')}>Shop All Products</Button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default SignatureCollection;
