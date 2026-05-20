"use client";

import React, { useEffect } from 'react';
import { useHomeStore } from '@/store/homeStore';
import { usePageStore } from '@/store/pageStore';
import { IMAGE_BASE } from '@/config/api';
import Link from 'next/link';
import './occasions.css';
import NewsletterSection from 'features/home/components/NewsletterSection/NewsletterSection';
import Testimonials from 'features/home/components/Testimonials/Testimonials';
import ContactHero from 'features/contact/components/ContactHero/ContactHero';
import ProductCard from 'components/ui/ProductCard';

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
            const metaTitle = pageContent.seo?.meta_title || pageContent.meta_title;
            const metaDescription = pageContent.seo?.meta_description || pageContent.meta_description;

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
    const occasionsList = pageContent?.occasions || [];

    const featuredProducts = homeData?.featured_products || [];

    // Extract section settings safely
    const heroSettings = pageContent?.hero_section;
    const occasionSecSettings = pageContent?.occasion_section;
    const featuredSecSettings = pageContent?.featured_products_section;
    const narrativeSettings = pageContent?.narrative_section;
    const isTestimonialsEnabled = pageContent?.testimonials_section?.is_enabled !== false;
    const isNewsletterEnabled = pageContent?.newsletter_section?.is_enabled !== false;
    const customContentHtml = pageContent?.custom_content?.html || pageContent?.content;

    return (
        <div className="occasions-page" style={{ 
            backgroundColor: '#ffffff',
            '--primary-theme-color': pageContent?.theme_settings?.primary_color || '#D4AF37'
        } as React.CSSProperties}>
            {/* Elegant Hero Header */}
            <ContactHero 
                overTitle={heroSettings?.over_title || "AUSPICIOUS CURATIONS"}
                title={heroSettings?.title || "Sarees Curated for Every Sacred Moment"}
                subtitle={heroSettings?.subtitle || "From the grandeur of holy vows to the joy of festive lights, explore our curated silk collections designed to wrap your special moments in pure handwoven luxury."}
                buttonText={heroSettings?.button_text || "Explore Collections"}
                imageUrl={heroSettings?.image_url || "https://images.unsplash.com/photo-1610030469983-98e550d6193c"}
            />

            {/* Premium Grid Section */}
            {occasionsList.length > 0 && (
                <section className="occasions-grid-section container">
                    <div className="occasions-header-block text-center">
                        <span className="section-category">{occasionSecSettings?.section_tag || "The Bridal & Festive Edits"}</span>
                        <h2 className="section-title">{occasionSecSettings?.section_title || "Shop by Occasion"}</h2>
                        <p className="section-description">
                            {occasionSecSettings?.section_description || "Every color carries a prayer, and every thread sings a legend. Select an occasion to discover its perfect drapery."}
                        </p>
                    </div>

                    <div className="row occasions-grid mt-5">
                        {occasionsList.map((occ: any, index: number) => {
                            const imageUrl = occ.image_url 
                                ? (occ.image_url.startsWith('http') ? occ.image_url : `${IMAGE_BASE}${occ.image_url}`)
                                : "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80";

                            return (
                                <div key={occ.occasion_id || index} className="col-lg-4 col-md-6 mb-5">
                                    <div className="occasion-premium-card">
                                        <div className="occasion-image-box">
                                            <img src={imageUrl} alt={occ.title || occ.name} className="occasion-card-img" />
                                            <div className="occasion-card-overlay"></div>
                                            <div className="occasion-accent-border"></div>
                                        </div>
                                        <div className="occasion-content-box">
                                            <h3 className="occasion-card-title">{occ.title || occ.name}</h3>
                                            <p className="occasion-card-desc">{occ.description || "Indulge in pure Kanchipuram mulberry silk sarees crafted with generational mastery."}</p>
                                            <Link href={occ.redirect_url || `/products?category=${occ.slug}`}>
                                                <button className="occasion-card-btn">
                                                    {occ.button_text || "Explore Collection"}
                                                    <i className="bi bi-arrow-right ms-2"></i>
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Featured Masterpieces Section */}
            {featuredSecSettings?.is_enabled !== false && featuredProducts.length > 0 && (
                <section className="occasions-products-section container pb-5">
                    <div className="occasions-header-block text-center mt-5 mb-5">
                        <span className="section-category">{featuredSecSettings?.section_tag || "Generational Artistry"}</span>
                        <h2 className="section-title">{featuredSecSettings?.section_title || "Trending Masterpieces"}</h2>
                        <p className="section-description">
                            {featuredSecSettings?.section_description || "Authentic weaves loved and selected by connoisseurs of timeless heritage."}
                        </p>
                    </div>
                    <div className="row">
                        {featuredProducts.slice(0, 3).map((product: any) => (
                            <div key={product.product_id} className="col-lg-4 col-md-6 mb-4">
                                <ProductCard product={product} />
                            </div>
                        ))}
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
                                {narrativeSettings?.quote || "A Kanchipuram saree is never just a dress; it is a sacred heritage, a masterpiece woven across months, carrying the dreams of master weavers and the pride of centuries."}
                            </blockquote>
                            <p className="narrative-author">— {narrativeSettings?.author || "The Weaver's Promise"}</p>
                        </div>
                    </div>
                </section>
            )}

            {/* Reusable UI Components to align look & feel */}
            {isTestimonialsEnabled && <Testimonials />}
            {isNewsletterEnabled && <NewsletterSection />}
        </div>
    );
};

export default OccasionsPage;
