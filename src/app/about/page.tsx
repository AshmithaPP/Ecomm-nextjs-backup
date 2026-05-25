"use client";

import React, { useEffect } from 'react';
import { usePageStore, PageItem } from '@/store/pageStore';
import NewsletterSection from 'features/home/components/NewsletterSection/NewsletterSection';
import Testimonials from 'features/home/components/Testimonials/Testimonials';
import ContactHero from 'features/contact/components/ContactHero/ContactHero';
import AboutSectionTwo from 'features/about/components/AboutSectionTwo/AboutSectionTwo';
import Heritageofkanchipuram from 'features/about/components/AboutSectionTwo/AboutSectionThree/Heritageofkanchipuram';
import TrustedHeritage from 'features/about/components/TrustedHeritage/TrustedHeritage';
import Mastersvoice from 'features/about/components/Mastersvoice/Mastersvoice';

const AboutPage: React.FC = () => {
    const { pages, loading, errors, fetchPageBySlug } = usePageStore();
    const pageContent = pages['about-us'];
    const isLoading = loading['about-us'];
    const error = errors['about-us'];

    useEffect(() => {
        if (pages['about-us'] === undefined) {
            fetchPageBySlug('about-us');
        }
    }, [fetchPageBySlug, pages]);

    // Helper to check if section exists and is enabled
    const isSectionEnabled = (section: any, defaultEnabled = true): boolean => {
        if (!section) return false;
        if (section.is_enabled !== undefined) return section.is_enabled === true;
        return defaultEnabled;
    };

    // Loading state
    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: '#800020', fontFamily: 'serif', fontSize: '18px' }}>
                <span className="animate-pulse">Woven into history...</span>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh', textAlign: 'center', padding: '2rem' }}>
                <h2 style={{ color: '#800020', fontFamily: 'serif' }}>Page Unavailable</h2>
                <p style={{ color: '#666', maxWidth: '500px', marginTop: '1rem' }}>
                    We're having trouble loading this page. Please try again later or contact support.
                </p>
                <button 
                    onClick={() => fetchPageBySlug('about-us')}
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

    // No content state
    if (!pageContent) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh', textAlign: 'center', padding: '2rem' }}>
                <h2 style={{ color: '#800020', fontFamily: 'serif' }}>Content Coming Soon</h2>
                <p style={{ color: '#666', maxWidth: '500px', marginTop: '1rem' }}>
                    This page is being woven with care. Please check back soon.
                </p>
            </div>
        );
    }

    // Convert API string pills to required component icon-label pairs
    const getMappedFeaturePills = (pills?: string[]): Array<{ icon: string; label: string }> | undefined => {
        if (!pills || !Array.isArray(pills) || pills.length === 0) return undefined;
        const iconClasses = ["bi-shop", "bi-stars", "bi-pentagon", "bi-gem", "bi-heart", "bi-patch-check"];
        return pills.map((pill, idx) => ({
            icon: iconClasses[idx % iconClasses.length],
            label: pill
        }));
    };

    return (
        <div className="about-page">
            {/* Hero Section - Required */}
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
            
            {/* About Section */}
            {isSectionEnabled(pageContent.about_section) && pageContent.about_section && (
                <div id="about-story">
                    <AboutSectionTwo 
                        title={pageContent.about_section.section_title}
                        description1={pageContent.about_section.description_1}
                        description2={pageContent.about_section.description_2}
                        quote={pageContent.about_section.quote}
                        imageUrl={pageContent.about_section.image_url}
                    />
                </div>
            )}
            
            {/* Heritage Section */}
            {isSectionEnabled(pageContent.heritage_section) && pageContent.heritage_section && pageContent.heritage_section.features && pageContent.heritage_section.features.length > 0 && (
                <Heritageofkanchipuram 
                    title={pageContent.heritage_section.section_title}
                    subtitle={pageContent.heritage_section.section_subtitle}
                    features={pageContent.heritage_section.features}
                />
            )}
            
            
            {/* Master's Voice Section */}
            {isSectionEnabled(pageContent.masters_voice_section) && pageContent.masters_voice_section && (
                <Mastersvoice 
                    label={pageContent.masters_voice_section.label}
                    quote={pageContent.masters_voice_section.quote}
                    name={pageContent.masters_voice_section.name}
                    title={pageContent.masters_voice_section.designation}
                    body={pageContent.masters_voice_section.description}
                    imageUrl={pageContent.masters_voice_section.image_url}
                    badgeNumber={pageContent.masters_voice_section.experience_badge?.number}
                    badgeText={pageContent.masters_voice_section.experience_badge?.text}
                />
            )}
            
            {/* Testimonials Section */}
            {(isSectionEnabled(pageContent.testimonials_section) || isSectionEnabled(pageContent.testimonial_section)) && <Testimonials />}
            
            {/* Newsletter Section */}
            {isSectionEnabled(pageContent.newsletter_section) && (
                <NewsletterSection
                    dynamicData={{
                        title: pageContent.newsletter_section?.title,
                        subtitle: pageContent.newsletter_section?.subtitle,
                        email_placeholder: pageContent.newsletter_section?.placeholder,
                        button_text: pageContent.newsletter_section?.button_text
                    }}
                />
            )}
            
            {/* Custom HTML Section */}
            {pageContent.custom_html_section?.html && (
                <div dangerouslySetInnerHTML={{ __html: pageContent.custom_html_section.html }} />
            )}
        </div>
    );
};

export default AboutPage;