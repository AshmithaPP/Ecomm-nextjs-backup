"use client";

import React, { useEffect } from 'react';
import { usePageStore } from '@/store/pageStore';
import ContactHero from 'features/contact/components/ContactHero/ContactHero';
import AboutSectionTwo from 'features/about/components/AboutSectionTwo/AboutSectionTwo';
import Heritageofkanchipuram from 'features/about/components/AboutSectionTwo/AboutSectionThree/Heritageofkanchipuram';
import TrustedHeritage from 'features/about/components/TrustedHeritage/TrustedHeritage';
import Mastersvoice from 'features/about/components/Mastersvoice/Mastersvoice';
import Testimonials from 'features/home/components/Testimonials/Testimonials';
import NewsletterSection from 'features/home/components/NewsletterSection/NewsletterSection';
import './heritage.css';

const HeritagePage: React.FC = () => {
    const { pages, loading, errors, fetchPageBySlug } = usePageStore();
    const pageContent = pages['heritage'];
    const isLoading = loading['heritage'];
    const error = errors['heritage'];

    useEffect(() => {
        if (pages['heritage'] === undefined) {
            fetchPageBySlug('heritage');
        }
    }, [fetchPageBySlug, pages]);

    const isSectionEnabled = (section: { is_enabled?: boolean } | undefined, defaultEnabled = true): boolean => {
        if (!section) return false;
        if (section.is_enabled !== undefined) return section.is_enabled === true;
        return defaultEnabled;
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: '#800020', fontFamily: 'serif', fontSize: '18px' }}>
                <span className="animate-pulse">Unfolding centuries of tradition...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh', textAlign: 'center', padding: '2rem' }}>
                <h2 style={{ color: '#800020', fontFamily: 'serif' }}>Heritage Page Unavailable</h2>
                <p style={{ color: '#666', maxWidth: '500px', marginTop: '1rem' }}>
                    We're having trouble loading this page. Please try again later.
                </p>
                <button 
                    onClick={() => fetchPageBySlug('heritage')}
                    style={{
                        marginTop: '2rem',
                        padding: '0.75rem 2rem',
                        backgroundColor: '#800020',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'serif',
                        borderRadius: '4px'
                    }}
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!pageContent) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh', textAlign: 'center', padding: '2rem' }}>
                <h2 style={{ color: '#800020', fontFamily: 'serif' }}>Heritage Content Coming Soon</h2>
                <p style={{ color: '#666', maxWidth: '500px', marginTop: '1rem' }}>
                    The story of our heritage is being woven. Please check back soon.
                </p>
            </div>
        );
    }

    return (
        <div className="heritage-page">
            {pageContent.hero_section && (
                <ContactHero 
                    overTitle={pageContent.hero_section.over_title}
                    title={pageContent.hero_section.title}
                    subtitle={pageContent.hero_section.subtitle}
                    buttonText={pageContent.hero_section.button_text}
                    buttonLink={pageContent.hero_section.button_link}
                    imageUrl={pageContent.hero_section.image_url}
                />
            )}
            
            {isSectionEnabled(pageContent.about_section_two) && pageContent.about_section_two &&
             (pageContent.about_section_two.title || pageContent.about_section_two.description_p1) && (
                <AboutSectionTwo 
                    title={pageContent.about_section_two.title}
                    description1={pageContent.about_section_two.description_p1}
                    description2={pageContent.about_section_two.description_p2}
                    quote={pageContent.about_section_two.quote}
                    imageUrl={pageContent.about_section_two.image_1 || pageContent.about_section_two.image_2}
                />
            )}
            
            {isSectionEnabled(pageContent.heritage_features_section) && pageContent.heritage_features_section && pageContent.heritage_features_section.features && pageContent.heritage_features_section.features.length > 0 && (
                <Heritageofkanchipuram 
                    title={pageContent.heritage_features_section.section_title}
                    subtitle={pageContent.heritage_features_section.section_subtitle}
                    features={pageContent.heritage_features_section.features}
                />
            )}
            
            {isSectionEnabled(pageContent.masters_voice_section) && pageContent.masters_voice_section && (
                <Mastersvoice 
                    label={pageContent.masters_voice_section.over_title || pageContent.masters_voice_section.label}
                    title={pageContent.masters_voice_section.weaver_role || pageContent.masters_voice_section.title || pageContent.masters_voice_section.designation}
                    quote={pageContent.masters_voice_section.quote}
                    name={pageContent.masters_voice_section.weaver_name || pageContent.masters_voice_section.name}
                    body={pageContent.masters_voice_section.description}
                    imageUrl={pageContent.masters_voice_section.image_url}
                    badgeNumber={pageContent.masters_voice_section.stat_number || pageContent.masters_voice_section.experience_badge?.number}
                    badgeText={pageContent.masters_voice_section.stat_label || pageContent.masters_voice_section.experience_badge?.text}
                />
            )}
            
            {isSectionEnabled(pageContent.trusted_heritage_section) && pageContent.trusted_heritage_section && (
                <TrustedHeritage 
                    overline={pageContent.trusted_heritage_section.overline}
                    headline={pageContent.trusted_heritage_section.headline || pageContent.trusted_heritage_section.title}
                    badgeText={pageContent.trusted_heritage_section.badge_text}
                    trustCards={(pageContent.trusted_heritage_section.trust_cards || pageContent.trusted_heritage_section.cards)?.map((card: any) => ({
                        title: card.title,
                        text: card.description || card.text
                    }))}
                    featurePills={pageContent.trusted_heritage_section.feature_pills ? pageContent.trusted_heritage_section.feature_pills.map((pill: string, idx: number) => ({
                        icon: ["bi-shop", "bi-stars", "bi-pentagon", "bi-gem", "bi-heart", "bi-patch-check"][idx % 6],
                        label: pill
                    })) : undefined}
                />
            )}
            
            {isSectionEnabled(pageContent.testimonials_section) && <Testimonials />}
            {isSectionEnabled(pageContent.newsletter_section) && <NewsletterSection />}
            
            {pageContent.custom_content?.html && (
                <div dangerouslySetInnerHTML={{ __html: pageContent.custom_content.html }} />
            )}
        </div>
    );
};

export default HeritagePage;

