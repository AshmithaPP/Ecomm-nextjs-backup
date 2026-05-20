"use client";

import styles from './TrustedHeritage.module.css';
import Image from 'next/image';
import trustedHeriIcon from 'assets/icons/ui/trustedheri1.png';

interface TrustCard {
    title: string;
    text: string;
}

interface FeaturePill {
    icon: string;
    label: string;
}

interface TrustedHeritageProps {
    overline?: string;
    headline?: string;
    badgeText?: string;
    trustCards?: TrustCard[];
    featurePills?: FeaturePill[];
}

const TrustedHeritage = ({
    overline = "Trusted Heritage",
    headline = "The Gold Standard of Authenticity",
    badgeText = "Silk Mark\nCertified",
    trustCards: customTrustCards,
    featurePills: customFeaturePills
}: TrustedHeritageProps) => {
    const defaultTrustCards = [
        {
            title: "Pure Silk Guarantee",
            text: "Every strand is tested for 100% natural mulberry silk content with no synthetic blends."
        },
        {
            title: "Handloom Weavers",
            text: "Direct support to authentic handloom communities, bypassing power-loom mass production."
        },
        {
            title: "Silk Mark Certification",
            text: "Official Silk Mark Organization of India tag provided with every purchase for absolute peace of mind."
        },
        {
            title: "Quality Inspection",
            text: "Rigid 3rd-stage inspection of zari weight, weave density, and thread count before shipping."
        }
    ];

    const defaultFeaturePills = [
        { icon: "bi-shop", label: "Direct From Weavers" },
        { icon: "bi-stars", label: "Limited Edition" },
        { icon: "bi-pentagon", label: "Premium Zari" },
        { icon: "bi-gem", label: "Bridal Expert Support" },
        { icon: "bi-heart", label: "Trusted By Customers" }
    ];

    const displayTrustCards = customTrustCards || defaultTrustCards;
    const displayFeaturePills = customFeaturePills || defaultFeaturePills;

    return (
        <section className={styles.trustedSectionWrapper}>
            <div className={styles.trustedInnerContainer}>
                {/* Header Area */}
                <div className={styles.trustedHeaderArea}>
                    <div className={styles.trustedTitleBlock}>
                        <p className={styles.trustedOverline}>{overline}</p>
                        <h2 className={styles.trustedHeadline}>{headline}</h2>
                    </div>

                    {/* Silk Mark Badge - EXACT REPLICA */}
                    <div className={styles.trustedCertificationBadge}>
                        <div className={styles.trustedCertIconBox}>
                            <Image src={trustedHeriIcon} alt="Silk Mark Certified" className={styles.trustedCertIcon} />
                        </div>
                        <p className={styles.trustedCertText}>
                            {badgeText.split('\n').map((line, idx) => (
                                <span key={idx}>
                                    {line}
                                    {idx < badgeText.split('\n').length - 1 && <br />}
                                </span>
                            ))}
                        </p>
                    </div>
                </div>

                {/* 4 Cards Grid */}
                <div className={styles.trustedCardsGrid}>
                    {displayTrustCards.map((card, index) => (
                        <div key={index} className={styles.trustedCard}>
                            <h3 className={styles.trustedCardTitle}>{card.title}</h3>
                            <p className={styles.trustedCardText}>{card.text}</p>
                        </div>
                     ))}
                </div>
            </div>

            {/* Bottom Section - Full Width */}
            <div className={styles.trustedBottomSection}>
                <div className={styles.trustedFeaturesGrid}>
                    {displayFeaturePills.map((feature, index) => (
                        <div key={index} className={styles.trustedFeatureBox}>
                            <div className={styles.trustedFeatureIconBg}>
                                <i className={`bi ${feature.icon} ${styles.trustedFeatureIcon}`}></i>
                            </div>
                            <p className={styles.trustedFeatureLabel}>{feature.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustedHeritage;
