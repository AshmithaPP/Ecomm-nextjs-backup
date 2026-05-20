"use client";

import React, { useEffect } from 'react';
import ContactHero from 'features/contact/components/ContactHero/ContactHero';
import ContactFeatures from 'features/contact/components/ContactFeatures/ContactFeatures';
import ContactForm from 'features/contact/components/ContactForm/ContactForm';
import NewsletterSection from 'features/home/components/NewsletterSection/NewsletterSection';
import { usePageStore } from '@/store/pageStore';

const ContactPage = () => {
    const { pages, loading, errors, fetchContactPage } = usePageStore();
    const pageContent = pages['contact-us'];
    const isLoading = loading['contact-us'];
    const error = errors['contact-us'];

    useEffect(() => {
        if (pages['contact-us'] === undefined) {
            fetchContactPage();
        }
    }, [fetchContactPage, pages]);

    if (isLoading) {
        return <div style={{ minHeight: '60vh' }} />;
    }

    if (error) {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Unable to load contact content.</p>
            </div>
        );
    }

    return (
        <div className="contact-page">
            <ContactHero
                overTitle={pageContent?.hero_section?.over_title}
                title={pageContent?.hero_section?.title}
                subtitle={pageContent?.hero_section?.subtitle}
                buttonText={pageContent?.hero_section?.button_text}
                buttonLink={pageContent?.hero_section?.button_link}
                imageUrl={pageContent?.hero_section?.image_url}
            />
            <ContactFeatures
                trustBadgesSection={pageContent?.trust_badges_section}
                contactCardsSection={pageContent?.contact_cards_section}
            />
            <ContactForm section={pageContent?.contact_form_section} />
            {(pageContent?.newsletter_section?.is_enabled !== false) && (
                <NewsletterSection
                    dynamicData={{
                        title: pageContent?.newsletter_section?.title,
                        subtitle: pageContent?.newsletter_section?.subtitle,
                        email_placeholder: pageContent?.newsletter_section?.placeholder,
                        button_text: pageContent?.newsletter_section?.button_text
                    }}
                />
            )}
        </div>
    );
};

export default ContactPage;
