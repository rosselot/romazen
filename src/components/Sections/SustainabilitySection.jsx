import React from 'react';
import styles from './SustainabilitySection.module.css';
import { motion } from 'framer-motion';
import { Leaf, Recycle, Heart } from 'lucide-react';

const SustainabilitySection = () => {
    const values = [
        {
            icon: <Leaf size={32} />,
            title: 'Clean Ingredients',
            description: '100% natural soy wax and therapeutic-grade essential oils.'
        },
        {
            icon: <Recycle size={32} />,
            title: 'Eco-Friendly',
            description: 'Recyclable packaging and sustainable sourcing practices.'
        },
        {
            icon: <Heart size={32} />,
            title: 'Artisan Made',
            description: 'Handcrafted in small batches with meticulous attention to detail.'
        }
    ];

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.grid}>
                    {values.map((value, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className={styles.card}
                        >
                            <div className={styles.icon}>{value.icon}</div>
                            <h3 className={styles.title}>{value.title}</h3>
                            <p className={styles.text}>{value.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SustainabilitySection;
