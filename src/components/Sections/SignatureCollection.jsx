import React from 'react';
import styles from './SignatureCollection.module.css';
import { PRODUCTS } from '../../data/products';
import Button from '../UI/Button';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import ResponsiveImage from '../UI/ResponsiveImage';

const SignatureCollection = ({
    products = PRODUCTS,
    eyebrow = 'One Scent · Six Forms',
    heading = 'The Gardenia & Jasmine Collection',
    subheading = 'A serene white-floral aroma shaped for every scale of ritual.',
    showFooterCta = true,
    isLoading = false,
    headingLevel = 'h2'
}) => {
    const navigate = useNavigate();
    const { addItem } = useCart();
    const Heading = headingLevel;

    if (isLoading) {
        return (
            <section className={styles.section}>
                <div className="container">
                    <div className={styles.header}>
                        <Heading className={styles.heading}>Loading Catalog...</Heading>
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
                    <Heading className={styles.heading}>{heading}</Heading>
                    <p className={styles.subheading}>{subheading}</p>
                </div>

                <div className={styles.grid}>
                    {products.map((product) => (
                        <article
                            key={product.id}
                            className={styles.productCard}
                        >
                            <div className={styles.imageWrapper}>
                                <ResponsiveImage
                                    src={product.image}
                                    naturalWidth={product.imageWidth}
                                    alt={product.name}
                                    className={styles.image}
                                    loading="lazy"
                                    decoding="async"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                />
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
                                <div className={styles.cardAction}>
                                    {!product.inStock && !product.isCandle ? (
                                        <span className={styles.soldOutAction} role="status">Currently sold out</span>
                                    ) : product.isCandle ? (
                                        <Button variant="dark" onClick={() => navigate('/prices')}>Explore All Six Forms</Button>
                                    ) : (
                                        <Button variant="dark" onClick={() => addItem(product)}>Add to Cart</Button>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {showFooterCta && (
                    <div className={styles.footer}>
                        <Button variant="outlineDark" size="large" onClick={() => navigate('/shop')}>Shop All Products</Button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default SignatureCollection;
