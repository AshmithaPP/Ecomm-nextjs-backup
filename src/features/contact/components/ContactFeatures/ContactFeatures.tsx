"use client";

import React from 'react';
import './ContactFeatures.css';

interface ContactFeaturesProps {
    trustBadgesSection?: {
        is_enabled?: boolean;
        badges?: Array<{ title: string; icon?: string }>;
    };
    contactCardsSection?: {
        section_title?: string;
        cards?: Array<{
            title: string;
            subtitle?: string;
            value?: string;
            action_text?: string;
            action_link?: string;
            icon?: string;
        }>;
    };
}

const iconMap: Record<string, string> = {
    shield: 'patch-check',
    lock: 'shield-lock',
    star: 'people-fill',
    loom: 'magic',
    phone: 'telephone-fill',
    whatsapp: 'whatsapp',
    mail: 'envelope-fill',
    map: 'shop-window'
};

const ContactFeatures = ({ trustBadgesSection, contactCardsSection }: ContactFeaturesProps) => {
    const featureHighlights = (trustBadgesSection?.badges || []).map((badge) => ({
        text: badge.title,
        icon: iconMap[badge.icon || ''] || 'patch-check'
    }));

    const contactOptions = (contactCardsSection?.cards || []).map((card) => ({
        icon: iconMap[card.icon || ''] || 'telephone-fill',
        title: card.title,
        description: card.subtitle || '',
        actionText: card.action_text || card.value || '',
        actionUrl: card.action_link || '#'
    }));

    return (
        <section className="contact-features-section">
            {/* Top Feature Bar */}
            {trustBadgesSection?.is_enabled !== false && featureHighlights.length > 0 && (
            <div className="feature-bar-wrapper">
                <div className="feature-bar-container">
                    {featureHighlights.map((feature, index) => (
                        <div key={index} className="feature-bar-item">
                            <i className={`bi bi-${feature.icon}`}></i>
                            <span>{feature.text}</span>
                        </div>
                    ))}
                </div>
            </div>
            )}

            {/* Contact Info Cards Section */}
            <div className="info-cards-section">
                <div className="info-cards-container">
                    <div className="info-cards-row">
                        {contactOptions.map((option, index) => (
                            <div key={index} className="info-card">
                                <div className="info-card__icon-box">
                                    <i className={`bi bi-${option.icon}`}></i>
                                </div>
                                <h3 className="info-card__title">{option.title}</h3>
                                <p className="info-card__description">{option.description}</p>
                                <a 
                                    href={option.actionUrl} 
                                    className="info-card__action"
                                    target={option.actionUrl.startsWith('http') ? "_blank" : undefined}
                                    rel={option.actionUrl.startsWith('http') ? "noopener noreferrer" : undefined}
                                >
                                    {option.actionText}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactFeatures;
