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
    imageUrl?: string;
}

const ContactHero = ({
    overTitle = "LEGACY OF THE LOOM",
    title = "Timeless Tradition Woven in Silk",
    subtitle = "Celebrating the heritage of authentic Kanchipuram silk sarees crafted by master weavers through generations of sacred geometry and golden threads.",
    buttonText = "Explore Collections",
    imageUrl
}: ContactHeroProps) => {
    
    // Fallback to static asset if no external image_url is supplied
    const resolvedImage = imageUrl 
        ? (imageUrl.startsWith('http') ? imageUrl : `${IMAGE_BASE}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`)
        : contactus.src;

    return (
        <section className="contact_hero_section">
            <div className="container h-100">
                <div className="row h-100">
                    <div className="col-md-6 contact_hero_left">
                        <p className="contact_hero_eyebrow">{overTitle}</p>
                        <h1 className="contact_hero_title">{title}</h1>
                        <p className="contact_hero_subtext">{subtitle}</p>
                        <button className="contact_hero_btn">{buttonText}</button>
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
