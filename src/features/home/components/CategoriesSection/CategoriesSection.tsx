"use client";

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import CategoryCard from './CategoryCard';
import styles from './CategoriesSection.module.css';

// Import local assets
import bridalSaree from 'assets/images/bridal/bridal_saree.png';
import traditionalSilk from 'assets/images/bridal/traditional_silk.png';
import lightweightSilk from 'assets/images/bridal/lightweight_silk.png';

import { resolveMediaUrl } from '@/config/api';

interface CategoryItem {
    category_id: string;
    slug: string;
    category_name: string;
    product_count: string;
    image_url: string;
    redirect_url: string;
}

interface CategoriesSectionProps {
    dynamicCategories?: CategoryItem[];
    useCarousel?: boolean; // New prop to toggle between grid and carousel
    title?: string;
    subtitle?: string;
}

const slugify = (value: string) => value
  .toString()
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const normalizeCategoryUrl = (url: string, title: string) => {
    if (!url) return '/collections/products';

    if (url.includes('/collections/products')) {
        return url;
    }

    if (url.startsWith('/products')) {
        return url.replace('/products', '/collections/products');
    }

    if (url.startsWith('/collections/')) {
        const categorySlug = url.split('/').pop() || slugify(title);
        return `/collections/products?category=${encodeURIComponent(categorySlug)}`;
    }

    const slug = slugify(title);
    return `/collections/products?category=${encodeURIComponent(slug)}`;
};

const CategoriesSection = ({ 
    dynamicCategories, 
    useCarousel = true, 
    title = "Shop by Category",
    subtitle = "Discover our exquisite collection of silk sarees"
}: CategoriesSectionProps) => {
    const router = useRouter();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Use dynamic data or fallback to local static data
    const categories = dynamicCategories && dynamicCategories.length > 0 
        ? dynamicCategories.map(cat => ({
            id: cat.category_id,
            title: cat.category_name,
            count: cat.product_count,
            imageUrl: resolveMediaUrl(cat.image_url),
            url: cat.redirect_url
        }))
        : [
            {
                id: 1,
                title: "Bridal Kanchipuram Sarees",
                count: "320+",
                imageUrl: bridalSaree,
                url: "/collections/bridal"
            },
            {
                id: 2,
                title: "Traditional Silk Sarees",
                count: "540+",
                imageUrl: traditionalSilk,
                url: "/collections/traditional"
            },
            {
                id: 3,
                title: "Lightweight Silk Sarees",
                count: "210+",
                imageUrl: lightweightSilk,
                url: "/collections/lightweight"
            }
        ];

    const handleCardClick = (title: string) => {
        const found = categories.find(c => c.title === title);
        const targetUrl = found ? normalizeCategoryUrl(found.url, title) : '/collections/products';
        console.log(`Category clicked: ${title}, navigating to: ${targetUrl}`);
        router.push(targetUrl);
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Render Carousel View only if requested and there are more than 3 categories
    const showAsCarousel = useCarousel && categories.length > 3;

    if (showAsCarousel) {
        return (
            <div className={styles.sectionContainer}>
                {/* Header Section */}
                <div className={styles.headerWrapper}>
                    <h2 className={styles.sectionTitle}>{title}</h2>
                    <p className={styles.sectionSubtitle}>{subtitle}</p>
                    <div className={styles.titleAccent}></div>
                </div>

                <div className={styles.carouselWrapper}>
                    <button 
                        className={`${styles.arrowBtn} ${styles.arrowLeft}`}
                        onClick={() => scroll('left')}
                        aria-label="Scroll left"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>

                    <div className={styles.scrollContainer} ref={scrollContainerRef}>
                        {categories.map((category) => (
                            <div key={category.id} className={styles.cardWrapper}>
                                <CategoryCard
                                    title={category.title}
                                    count={category.count}
                                    imageUrl={category.imageUrl}
                                    onClick={handleCardClick}
                                />
                            </div>
                        ))}
                    </div>

                    <button 
                        className={`${styles.arrowBtn} ${styles.arrowRight}`}
                        onClick={() => scroll('right')}
                        aria-label="Scroll right"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

    // Render Grid View (Default - matches your updated CategoryCard)
    return (
        <div className={styles.sectionContainer}>
            {/* Header Section with aesthetic feel */}
            <div className={styles.headerWrapper}>
                <h2 className={styles.sectionTitle}>{title}</h2>
                <p className={styles.sectionSubtitle}>{subtitle}</p>
                <div className={styles.titleAccent}></div>
            </div>

            <div className={`row g-4 justify-content-center ${styles.customGutter}`}>
                {categories.map((category) => (
                    <div key={category.id} className="col-lg-4 col-md-6 col-12 d-flex justify-content-center">
                        <CategoryCard
                            title={category.title}
                            count={category.count}
                            imageUrl={category.imageUrl}
                            onClick={handleCardClick}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoriesSection;