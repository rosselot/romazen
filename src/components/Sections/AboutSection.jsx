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
                        <span className={styles.eyebrow}>The RomaZen Signature</span>
                        <h2 className={styles.heading}>A Garden in the <br /> Heart of the City.</h2>
                        <p className={styles.text}>
                            RomaZen is a boutique candle house born in New York. Our signature aroma pairs the creamy radiance of gardenia with the soft, sensual lift of jasmine—an elegant white-floral composition made for moments of stillness.
                        </p>
                        <p className={styles.text}>
                            The same fragrance is hand-poured into four clear-glass forms, allowing you to choose the scale of the ritual while keeping a calm, architectural language throughout your home.
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
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
