"use client";

import React from 'react';
import './ContactHero.css';
import Image from 'next/image';
import contactus from 'assets/images/contactus/contactus.png';
import { IMAGE_BASE } from '@/config/api';

interface ContactHeroProps {
    overTitle?: string;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
    imageUrl?: string;
}

const ContactHero = ({
    overTitle = "",
    title = "",
    subtitle = "",
    buttonText = "",
    buttonLink,
    imageUrl
}: ContactHeroProps) => {
    
    // Fallback to static asset if no external image_url is supplied or if it points to the default missing blog_hero.png
    const resolvedImage = (imageUrl && !imageUrl.includes('blog_hero.png'))
        ? ((imageUrl.startsWith('http') || imageUrl.startsWith('/_next/')) ? imageUrl : `${IMAGE_BASE}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`)
        : contactus.src;

    return (
        <section className="contact_hero_section">
            <div className="container h-100">
                <div className="row h-100">
                    <div className="col-md-6 contact_hero_left">
                        <p className="contact_hero_eyebrow">{overTitle}</p>
                        <h1 className="contact_hero_title">{title}</h1>
                        <p className="contact_hero_subtext">{subtitle}</p>
                        {buttonLink ? (
                            <a href={buttonLink}>
                                <button className="contact_hero_btn">{buttonText}</button>
                            </a>
                        ) : (
                            <button className="contact_hero_btn">{buttonText}</button>
                        )}
                    </div>
                    <div className="col-md-6 contact_hero_right d-none d-md-flex">
                        <img 
                            src={resolvedImage} 
                            alt="Saree Model" 
                            className="contact_hero_img img-fluid"
                            style={{ maxHeight: '100%', width: 'auto', objectFit: 'contain' }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactHero;
