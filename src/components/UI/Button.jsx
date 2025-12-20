import React from 'react';
import styles from './Button.module.css';
import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', size = 'medium', className = '', ...props }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;
