import React from 'react';
import styles from './Newsletter.module.css';
import Button from '../UI/Button';
import { motion } from 'framer-motion';

const Newsletter = () => {
    return (
        <section className={styles.section}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={styles.content}
                >
                    <h2 className={styles.heading}>Join the Romazen Circle</h2>
                    <p className={styles.text}>Exclusive launches & refined moments, delivered to your inbox.</p>

                    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                        <label htmlFor="newsletter-email" className={styles.srOnly}>Email address</label>
                        <input
                            id="newsletter-email"
                            type="email"
                            placeholder="Your email address"
                            autoComplete="email"
                            required
                            className={styles.input}
                        />
                        <Button variant="primary" type="submit">Subscribe</Button>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};

export default Newsletter;
