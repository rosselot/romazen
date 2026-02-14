import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Button from '../components/UI/Button';
import styles from './PageTemplates.module.css';
import { usePageMeta } from '../hooks/usePageMeta';

const BasicPage = ({
    title,
    description,
    eyebrow,
    body,
    ctaLabel,
    ctaTo,
    noIndex = false,
    children
}) => {
    const navigate = useNavigate();
    const heading = title.includes('|') ? title.split('|')[0].trim() : title;

    usePageMeta({ title, description, noIndex });

    return (
        <Layout>
            <section className={styles.page}>
                <div className="container">
                    <div className={styles.inner}>
                        <span className={styles.eyebrow}>{eyebrow}</span>
                        <h1 className={styles.title}>{heading}</h1>
                        <p className={styles.text}>{body}</p>

                        {ctaLabel && ctaTo && (
                            <div className={styles.actions}>
                                <Button variant="primary" onClick={() => navigate(ctaTo)}>{ctaLabel}</Button>
                            </div>
                        )}

                        {children && <div className={styles.richText}>{children}</div>}
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default BasicPage;
