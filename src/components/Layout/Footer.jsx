import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.brand}>
                        <Link to="/" className={styles.logo}>ROMAZEN</Link>
                        <p className={styles.tagline}>Elegance in Every Breath.</p>
                    </div>

                    <div className={styles.links}>
                        <h4 className={styles.heading}>Explore</h4>
                        <ul>
                            <li><Link to="/candles">Soy Candles</Link></li>
                            <li><Link to="/soaps">Artisanal Soaps</Link></li>
                            <li><Link to="/fragrances">Home Fragrances</Link></li>
                            <li><Link to="/cleaning">Eco Cleaning</Link></li>
                        </ul>
                    </div>

                    <div className={styles.links}>
                        <h4 className={styles.heading}>Company</h4>
                        <ul>
                            <li><Link to="/about">Our Story</Link></li>
                            <li><Link to="/sustainability">Sustainability</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    <div className={styles.instagram}>
                        <h4 className={styles.heading}>Instagram</h4>
                        <div className={styles.igGrid}>
                            <div className={styles.igItem}></div>
                            <div className={styles.igItem}></div>
                            <div className={styles.igItem}></div>
                            <div className={styles.igItem}></div>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>&copy; {new Date().getFullYear()} Romazen. Inspired by NYC. Handcrafted for you.</p>
                    <div className={styles.legal}>
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
