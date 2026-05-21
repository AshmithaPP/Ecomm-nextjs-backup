"use client";

import React from 'react';
import styles from './AboutSectionTwo.module.css';
import Image from 'next/image';
import weavingLoomImg from 'assets/images/about/weaving_loom.png';
import { resolveMediaUrl } from '@/config/api';

interface AboutSectionTwoProps {
    title?: string;
    description1?: string;
    description2?: string;
    quote?: string;
    imageUrl?: string;
}

const AboutSectionTwo = ({
    title = "The Soul of Our Weave",
    description1 = "Our journey began with a simple yet profound vision: to preserve the diminishing art of the pure Kanchipuram weave. For centuries, the rhythmic click-clack of the loom has been the heartbeat of our community.",
    description2 = "Heritage Weaves is more than a brand; it is a collaborative sanctuary where master weavers find dignity and enthusiasts find authenticity. We specialize in the Korvai technique—the sacred joining of a contrasting border to the body of the saree—a hallmark of true artisanal skill.",
    quote = "\"Every saree we create is a piece of wearable history, a prayer offered in silk and gold.\"",
    imageUrl
}: AboutSectionTwoProps) => {
    const resolvedImage = (imageUrl && !imageUrl.includes('blog_hero.png'))
        ? resolveMediaUrl(imageUrl)
        : weavingLoomImg.src;

    return (
        <section className={styles.aboutSectionWrapper}>
            <div className={styles.aboutContainer}>
                {/* Left Side: Image */}
                <div className={styles.aboutImageWrapper}>
                    <img 
                        src={resolvedImage} 
                        alt="Traditional Kanchipuram Weaving Loom" 
                        className={styles.aboutImage}
                        style={{ width: '100%', height: 'auto' }}
                    />
                </div>
 
                {/* Right Side: Content */}
                <div className={styles.aboutContentColumn}>
                    <div className={styles.aboutTitleBlock}>
                        <h2 className={styles.aboutTitle}>{title}</h2>
                        <div className={styles.aboutDivider}></div>
                    </div>
 
                    <p className={styles.aboutDescription1}>
                        {description1}
                    </p>
 
                    <p className={styles.aboutDescription2}>
                        {description2}
                    </p>
 
                    <p className={styles.aboutQuote}>
                        {quote}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default AboutSectionTwo;
