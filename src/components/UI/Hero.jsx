import React from 'react';
import styles from './Hero.module.css';
import Button from './Button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className={styles.hero}>
            <div className={styles.overlay}></div>
            <div className={styles.content}>
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className={styles.eyebrow}
                >
                    Established in NYC
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={styles.headline}
                >
                    Elegance in <br /> Every Breath.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className={styles.subheadline}
                >
                    Premium handcrafted candles, soaps, and home fragrances <br />
                    inspired by the rhythm of New York.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className={styles.cta}
                >
                    <Button variant="primary" size="large" onClick={() => navigate('/shop')}>Shop Collection</Button>
                    <Button variant="secondary" size="large" onClick={() => navigate('/about')}>Discover Romazen</Button>
                </motion.div>
            </div>

            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className={styles.backgroundImage}
            />
        </section>
    );
};

export default Hero;
