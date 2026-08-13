import React from 'react';
import styles from './Newsletter.module.css';
import Button from '../UI/Button';

const Newsletter = () => {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.content}>
                    <h2 className={styles.heading}>Join the Romazen Circle</h2>
                    <p className={styles.text}>Exclusive launches & refined moments, delivered to your inbox.</p>

                    <form className={styles.form} aria-describedby="newsletter-status" onSubmit={(e) => e.preventDefault()}>
                        <label htmlFor="newsletter-email" className={styles.srOnly}>Email address</label>
                        <input
                            id="newsletter-email"
                            type="email"
                            placeholder="Your email address"
                            autoComplete="email"
                            required
                            disabled
                            className={styles.input}
                        />
                        <Button variant="dark" type="submit" disabled>Coming Soon</Button>
                    </form>
                    <p id="newsletter-status" className={styles.status} role="status">
                        Signup is paused while we finish the consent-safe mailing list connection.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
