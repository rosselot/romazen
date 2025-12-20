import React from 'react';
import styles from './SignatureCollection.module.css';
import { PRODUCTS } from '../../data/products';
import { motion } from 'framer-motion';
import Button from '../UI/Button';

const SignatureCollection = () => {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <span className={styles.eyebrow}>Curated Selection</span>
                    <h2 className={styles.heading}>Signature Collection</h2>
                    <p className={styles.subheading}>Explore our most-loved artisanal creations.</p>
                </div>

                <div className={styles.grid}>
                    {PRODUCTS.map((product, index) => (
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
                                    <Button variant="primary">Add to Cart</Button>
                                </div>
                            </div>
                            <div className={styles.info}>
                                <span className={styles.category}>{product.category}</span>
                                <h3 className={styles.name}>{product.name}</h3>
                                <p className={styles.notes}>{product.notes}</p>
                                <span className={styles.price}>{product.price}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className={styles.footer}>
                    <Button variant="secondary" size="large">Shop All Products</Button>
                </div>
            </div>
        </section>
    );
};

export default SignatureCollection;
