import React from 'react';
import styles from './AboutSection.module.css';
import { motion } from 'framer-motion';

const AboutSection = () => {
    return (
        <section className={styles.about}>
            <div className="container">
                <div className={styles.grid}>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className={styles.imageWrapper}
                    >
                        <img
                            src="/assets/images/product-soap-artisanal.png"
                            alt="Romazen Artisanal Soap"
                            className={styles.image}
                        />
                        <div className={styles.accentBox}></div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={styles.content}
                    >
                        <span className={styles.eyebrow}>The Essence of Romazen</span>
                        <h2 className={styles.heading}>Inspired by the Rhythm <br /> of New York.</h2>
                        <p className={styles.text}>
                            Romazen is a boutique wellness house born in the heart of NYC. We believe that true luxury lies in moments of stillness amidst the urban bustle. Our products are handcrafted in small batches, using only the finest natural ingredients and sustainable practices.
                        </p>
                        <p className={styles.text}>
                            From the sophistication of Wall Street to the serenity of a rooftop garden, every scent and texture is designed to bring a touch of Manhattan elegance into your sanctuary.
                        </p>
                        <div className={styles.stats}>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>100%</span>
                                <span className={styles.statLabel}>Natural Soy</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>Small</span>
                                <span className={styles.statLabel}>Batch Craft</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
