import React from 'react';
import styles from './SustainabilitySection.module.css';
import { Leaf, Shapes, Heart } from 'lucide-react';

const SustainabilitySection = () => {
    const values = [
        {
            icon: <Leaf size={32} />,
            title: 'Soy Wax',
            description: 'Hand-poured soy wax with a refined Gardenia & Jasmine fragrance composition.'
        },
        {
            icon: <Shapes size={32} />,
            title: 'Six Glass Forms',
            description: 'Two intimate and four architectural silhouettes for different rooms and rituals.'
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
                <h2 className="srOnly">Our values</h2>
                <div className={styles.grid}>
                    {values.map((value) => (
                        <article key={value.title} className={styles.card}>
                            <div className={styles.icon}>{value.icon}</div>
                            <h3 className={styles.title}>{value.title}</h3>
                            <p className={styles.text}>{value.description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SustainabilitySection;
