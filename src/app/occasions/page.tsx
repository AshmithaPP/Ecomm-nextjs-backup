"use client";

import React, { useEffect } from 'react';
import { useHomeStore } from '@/store/homeStore';
import { usePageStore } from '@/store/pageStore';
import { resolveMediaUrl } from '@/config/api';
import Link from 'next/link';
import './occasions.css';
import NewsletterSection from 'features/home/components/NewsletterSection/NewsletterSection';
import Testimonials from 'features/home/components/Testimonials/Testimonials';
import ContactHero from 'features/contact/components/ContactHero/ContactHero';

const OccasionsPage = () => {
    const { homeData, fetchHomeData } = useHomeStore();
    const { pages, fetchPageBySlug } = usePageStore();
    const pageContent = pages['occasions'];

    useEffect(() => {
        fetchHomeData();
        fetchPageBySlug('occasions');
    }, [fetchHomeData, fetchPageBySlug]);

    useEffect(() => {
        if (pageContent) {
            const metaTitle = pageContent.seo?.meta_title ?? pageContent.meta_title;
            const metaDescription = pageContent.seo?.meta_description ?? pageContent.meta_description;

            if (metaTitle) {
                document.title = metaTitle;
            }
            if (metaDescription) {
                const metaDesc = document.querySelector('meta[name="description"]');
                if (metaDesc) {
                    metaDesc.setAttribute('content', metaDescription);
                } else {
                    const newMeta = document.createElement('meta');
                    newMeta.name = 'description';
                    newMeta.content = metaDescription;
                    document.head.appendChild(newMeta);
                }
            }
        }
    }, [pageContent]);

    // Use occasions list from backend dynamic payload
    const occasionsList = pageContent?.occasions ?? [];

    const featuredProducts = homeData?.featured_products ?? [];

    const slugify = (value: string) => value
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const buildOccasionLink = (occ: any) => {
      if (occ.slug) {
        return `/collections/products?occasion=${encodeURIComponent(occ.slug)}`;
      }
      if (occ.redirect_url?.includes('/collections/products?occasion=')) {
        return occ.redirect_url;
      }
      if (occ.redirect_url?.startsWith('/occasion/')) {
        const slug = occ.redirect_url.split('/').pop() || slugify(occ.title || occ.name || '');
        return `/collections/products?occasion=${encodeURIComponent(slug)}`;
      }
      const slug = slugify(occ.title || occ.name || '');
      return `/collections/products?occasion=${encodeURIComponent(slug)}`;
    };

    const heroSettings = pageContent?.hero_section;
    const occasionSecSettings = pageContent?.occasion_section;
    const featuredSecSettings = pageContent?.featured_products_section;
    const narrativeSettings = pageContent?.narrative_section;
    const isTestimonialsEnabled = pageContent?.testimonials_section?.is_enabled !== false;
    const isNewsletterEnabled = pageContent?.newsletter_section?.is_enabled !== false;
    const customContentHtml = pageContent?.custom_content?.html ?? pageContent?.content;

    return (
        <div className="occasions-page" style={{ 
            backgroundColor: '#ffffff',
            '--primary-theme-color': pageContent?.theme_settings?.primary_color ?? '#D4AF37'
        } as React.CSSProperties}>
            {/* Elegant Hero Header */}
            {heroSettings && (
                <ContactHero 
                    overTitle={heroSettings.over_title}
                    title={heroSettings.title}
                    subtitle={heroSettings.subtitle}
                    buttonText={heroSettings.button_text}
                    imageUrl={heroSettings.image_url}
                />
            )}

            {/* Premium Grid Section */}
            {occasionsList.length > 0 && (
                <section className="occasions-grid-section container">
                    <div className="occasions-header-block text-center">
                        <span className="section-category">{occasionSecSettings?.section_tag ?? ''}</span>
                        <h2 className="section-title">{occasionSecSettings?.section_title ?? ''}</h2>
                        <p className="section-description">
                            {occasionSecSettings?.section_description ?? ''}
                        </p>
                    </div>

                    <div className="row occasions-grid mt-5">
                        {occasionsList.map((occ: any, index: number) => {
                            const imageUrl = resolveMediaUrl(occ.image_url);

                            return (
                                <div key={occ.occasion_id || index} className="col-lg-4 col-md-6 mb-5">
                                    <Link href={buildOccasionLink(occ)} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                        <div className="occasion-premium-card" style={{ cursor: 'pointer' }}>
                                            <div className="occasion-image-box">
                                                <img src={imageUrl} alt={occ.title ?? occ.name} className="occasion-card-img" />
                                                <div className="occasion-card-overlay"></div>
                                                <div className="occasion-accent-border"></div>
                                            </div>
                                            <div className="occasion-content-box">
                                                <h3 className="occasion-card-title">{occ.title ?? occ.name}</h3>
                                                <p className="occasion-card-desc">{occ.description ?? ''}</p>
                                                <div className="occasion-card-btn">
                                                    {occ.button_text ?? ''}
                                                    <i className="bi bi-arrow-right ms-2"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

          

            {/* Dynamic Custom CMS Rich Text Content Section */}
            {customContentHtml && customContentHtml !== '<p>Dynamic content for Occasions page.</p>' && (
                <section className="occasions-dynamic-content container py-4" style={{ marginBottom: '40px' }}>
                    <div 
                        className="cms-rich-content-wrapper"
                        style={{
                            fontSize: '16px',
                            color: '#63504A',
                            lineHeight: '1.7',
                            maxWidth: '900px',
                            margin: '0 auto',
                            padding: '30px',
                            borderLeft: '3px solid #D4AF37',
                            backgroundColor: '#faf8f6',
                            borderRadius: '0 8px 8px 0',
                            textAlign: 'center'
                        }}
                        dangerouslySetInnerHTML={{ __html: customContentHtml }}
                    />
                </section>
            )}

            {/* Aesthetic Narrative Callout */}
            {narrativeSettings?.is_enabled !== false && (
                <section className="occasions-narrative-section">
                    <div className="container text-center">
                        <div className="narrative-border">
                            <i className="bi bi-gem narrative-icon"></i>
                            <blockquote className="narrative-quote">
                                {narrativeSettings?.quote ?? ''}
                            </blockquote>
                            <p className="narrative-author">— {narrativeSettings?.author ?? ''}</p>
                        </div>
                    </div>
                </section>
            )}

            {/* Reusable UI Components to align look & feel */}
            {isTestimonialsEnabled && <Testimonials />}
            {isNewsletterEnabled && (
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

export default OccasionsPage;
