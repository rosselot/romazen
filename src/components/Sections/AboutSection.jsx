import React from 'react';
import styles from './AboutSection.module.css';
import ResponsiveImage from '../UI/ResponsiveImage';

const AboutSection = () => {
    return (
        <section className={styles.about}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.imageWrapper}>
                        <ResponsiveImage
                            src="/assets/images/romazen-limited-four-sizes.jpeg"
                            naturalWidth={1122}
                            alt="The four RomaZen sculptural candle forms with gold labels"
                            className={styles.image}
                            loading="lazy"
                            decoding="async"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className={styles.accentBox}></div>
                    </div>

                    <div className={styles.content}>
                        <span className={styles.eyebrow}>From Chile to New York</span>
                        <h2 className={styles.heading}>A candle-making craft <br /> finds a new home.</h2>
                        <p className={styles.text}>
                            RomaZen began with a Chilean candle maker bringing her love of elegant forms and carefully balanced aromas to New York. Every candle is hand-poured in small batches for a warm, personal ritual at home.
                        </p>
                        <p className={styles.text}>
                            Our signature fragrance pairs luminous gardenia with soft jasmine and is poured into six clear-glass forms, so you can choose the scale of the ritual while keeping one calm, architectural language throughout your home.
                        </p>
                        <div className={styles.stats}>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>Six</span>
                                <span className={styles.statLabel}>Glass Forms</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>Small</span>
                                <span className={styles.statLabel}>Batch Craft</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
