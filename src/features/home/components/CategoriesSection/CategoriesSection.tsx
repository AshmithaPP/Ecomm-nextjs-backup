"use client";

import React from 'react';
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
}

const slugify = (value: string) => value
  .toString()
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const normalizeCategoryUrl = (url: string, title: string) => {
    if (!url) return '/collections/products';

    // If it's already a full collection products URL, keep it
    if (url.includes('/collections/products')) {
        return url;
    }

    // If it points to /products, rewrite to /collections/products
    if (url.startsWith('/products')) {
        return url.replace('/products', '/collections/products');
    }

    // If it's /collections/bridal, /collections/traditional, /collections/lightweight, etc.
    if (url.startsWith('/collections/')) {
        const categorySlug = url.split('/').pop() || slugify(title);
        return `/collections/products?category=${encodeURIComponent(categorySlug)}`;
    }

    // Default to /collections/products with category slug
    const slug = slugify(title);
    return `/collections/products?category=${encodeURIComponent(slug)}`;
};

const CategoriesSection = ({ dynamicCategories }: CategoriesSectionProps) => {
    const router = useRouter();

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

    return (
        <div className={styles.sectionContainer}>
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

