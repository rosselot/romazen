import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Shop All', path: '/shop' },
        { name: 'Candles', path: '/candles' },
        { name: 'Soaps', path: '/soaps' },
        { name: 'About', path: '/about' },
    ];

    const useScrolledStyle = scrolled || !isHome;

    return (
        <nav className={`${styles.navbar} ${useScrolledStyle ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                <button
                    type="button"
                    aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    aria-expanded={isOpen}
                    className={styles.menuButton}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <Link to="/" className={styles.logo}>
                    ROMAZEN
                </Link>

                <div className={styles.desktopLinks}>
                    {navLinks.map((link) => (
                        <Link key={link.name} to={link.path} className={styles.link}>
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className={styles.actions}>
                    <button type="button" aria-label="Open shopping bag" className={styles.iconButton}>
                        <ShoppingBag size={20} />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={styles.mobileMenu}
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={styles.mobileLink}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
