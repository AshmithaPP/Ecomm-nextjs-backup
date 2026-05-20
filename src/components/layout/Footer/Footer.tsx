"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Footer.css';
import LogoWhite from 'assets/images/logo/Logo-SareeEcom.png';
import footerCards from 'assets/images/footerCards.png';
import fbIcon from 'assets/icons/social/facebookicon.png';
import instaIcon from 'assets/icons/social/instaicon.png';
import linkedinIcon from 'assets/icons/social/linkedinicon.png';
import twitterIcon from 'assets/icons/social/twittericon.png';
import Image from 'next/image';

import { useSettingsStore } from '@/store/settingsStore';
import { IMAGE_BASE } from '@/config/api';

const Footer = () => {
    const { getSiteInfo, fetchSettings, getFooterSettings } = useSettingsStore();
    const siteInfo = getSiteInfo();
    const footer = getFooterSettings();
    const IMAGE_BASE_URL = IMAGE_BASE;

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const logoSrc = siteInfo.site_logo
        ? (siteInfo.site_logo.startsWith('http') ? siteInfo.site_logo : `${IMAGE_BASE_URL}${siteInfo.site_logo}`)
        : LogoWhite;

    return (
        <footer className="footer-section">
            <div className="container footer-container">
                <div className="row footer-row">

                    {/* Column 1: Logo, Address, Contact, Socials */}
                    <div className="col-lg-4 col-md-6 mb-4 footer-col-info">
                        <div className="footer-logo-container">
                            <img 
                                src={typeof logoSrc === 'string' ? logoSrc : (logoSrc as any).src} 
                                alt={siteInfo.site_title || "Kanchipuram Silks Logo"} 
                                className="footer-logo" 
                                style={{ height: 'auto', maxWidth: '200px' }} 
                                onError={(e: any) => {
                                    e.target.onerror = null;
                                    e.target.src = typeof LogoWhite === 'string' ? LogoWhite : (LogoWhite as any).src;
                                }}
                            />
                        </div>
                        <p className="footer-text footer-about-text" style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '16px' }}>
                            {footer.about_text}
                        </p>
                        <p className="footer-text footer-address" style={{ marginBottom: '10px' }}>
                            <i className="bi bi-geo-alt-fill" style={{ color: '#D4AF37', marginRight: '6px' }}></i>
                            {footer.contact_info?.address || siteInfo.address}
                        </p>
                        <p className="footer-text footer-contact">
                            <span style={{ display: 'block', marginBottom: '4px' }}>
                                <i className="bi bi-telephone-fill" style={{ color: '#D4AF37', marginRight: '6px' }}></i>
                                {footer.contact_info?.phone || siteInfo.phone}
                            </span>
                            <span>
                                <i className="bi bi-envelope-fill" style={{ color: '#D4AF37', marginRight: '6px' }}></i>
                                {footer.contact_info?.email || siteInfo.email}
                            </span>
                        </p>
                        
                        <div className="social-icons" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '16px' }}>
                            {footer.social_links?.facebook && (
                                <a href={footer.social_links.facebook} target="_blank" rel="noopener noreferrer" className="social-icon-link">
                                    <Image src={fbIcon} alt="Facebook" className="social-icon" width={20} height={20} />
                                </a>
                            )}
                            {footer.social_links?.instagram && (
                                <a href={footer.social_links.instagram} target="_blank" rel="noopener noreferrer" className="social-icon-link">
                                    <Image src={instaIcon} alt="Instagram" className="social-icon" width={20} height={20} />
                                </a>
                            )}
                            {footer.social_links?.twitter && (
                                <a href={footer.social_links.twitter} target="_blank" rel="noopener noreferrer" className="social-icon-link">
                                    <Image src={twitterIcon} alt="Twitter" className="social-icon" width={20} height={20} />
                                </a>
                            )}
                            {footer.social_links?.youtube && (
                                <a href={footer.social_links.youtube} target="_blank" rel="noopener noreferrer" className="social-icon-link" style={{ fontSize: '18px', color: '#fff', display: 'flex', alignItems: 'center' }}>
                                    <i className="bi bi-youtube"></i>
                                </a>
                            )}
                            {footer.social_links?.whatsapp && (
                                <a href={footer.social_links.whatsapp} target="_blank" rel="noopener noreferrer" className="social-icon-link" style={{ fontSize: '18px', color: '#fff', display: 'flex', alignItems: 'center' }}>
                                    <i className="bi bi-whatsapp"></i>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Column 2: Quick Links (links_group_1) */}
                    <div className="col-lg-2 col-md-6 mb-4 footer-col-links" style={{ paddingLeft: '20px' }}>
                        <h5 className="footer-heading" style={{ color: '#D4AF37', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', paddingBottom: '8px', fontSize: '14px', letterSpacing: '1px' }}>
                            EXPLORE
                        </h5>
                        <ul className="footer-links-list">
                            {footer.links_group_1?.map((link: any, idx: number) => (
                                <li key={idx}>
                                    <Link href={link.path || '#'}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Legal & Info (links_group_2) */}
                    <div className="col-lg-3 col-md-6 mb-4 footer-col-links" style={{ paddingLeft: '20px' }}>
                        <h5 className="footer-heading" style={{ color: '#D4AF37', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', paddingBottom: '8px', fontSize: '14px', letterSpacing: '1px' }}>
                            POLICIES & LEGAL
                        </h5>
                        <ul className="footer-links-list">
                            {footer.links_group_2?.map((link: any, idx: number) => (
                                <li key={idx}>
                                    <Link href={link.path || '#'}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Secure Payments */}
                    <div className="col-lg-3 col-md-6 mb-4 footer-col-payments">
                        <h5 className="footer-heading" style={{ color: '#D4AF37', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', paddingBottom: '8px', fontSize: '14px', letterSpacing: '1px' }}>
                            SECURE PAYMENTS
                        </h5>
                        <div className="payment-icons-container" style={{ marginTop: '16px' }}>
                            <Image src={footerCards} alt="Secure Payments Methods" className="payment-cards-img" width={282} height={41} />
                        </div>
                    </div>

                </div>
            </div>

            <div className="footer-divider-container">
                <hr className="footer-divider" />
            </div>

            <div className="container text-center">
                <p className="footer-copyright" style={{ fontSize: '13px', color: '#94a3b8' }}>
                    {footer.copyright_text}
                </p>
            </div>
        </footer>
    );
};

export default Footer;
