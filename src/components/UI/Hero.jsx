import React from 'react';
import styles from './Hero.module.css';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className={styles.hero}>
            <div className={styles.overlay}></div>
            <div className={styles.content}>
                <span className={styles.eyebrow}>
                    Chilean candle craft · Hand-poured in New York
                </span>

                <h1 className={styles.headline}>
                    Sculptural candles. <br /> A new home in New York.
                </h1>

                <p className={styles.subheadline}>
                    A Chilean candle maker brings her craft to six clear-glass forms, <br />
                    all scented with luminous Gardenia &amp; Jasmine.
                </p>

                <div className={styles.cta}>
                    <Button variant="primary" size="large" onClick={() => navigate('/prices')}>Shop Available Candles</Button>
                    <Button variant="secondary" size="large" onClick={() => navigate('/about')}>Meet the Maker</Button>
                </div>
            </div>

            <picture className={styles.backgroundImage} aria-hidden="true">
                <source type="image/avif" srcSet="/assets/images/optimized/hero-bg-480.avif 480w, /assets/images/optimized/hero-bg.avif 959w" sizes="100vw" />
                <source type="image/webp" srcSet="/assets/images/optimized/hero-bg-480.webp 480w, /assets/images/optimized/hero-bg.webp 959w" sizes="100vw" />
                <img src="/assets/images/optimized/hero-bg.webp" alt="" fetchPriority="high" decoding="async" />
            </picture>
        </section>
    );
};

export default Hero;
