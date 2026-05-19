import React from 'react';
import ProductDetailsClient from './ProductDetailsClient';
import { API_BASE, IMAGE_BASE } from '@/config/api';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const slug = resolvedParams.id;
    
    try {
        const res = await fetch(`${API_BASE}/products/${slug}`, { next: { revalidate: 60 } });
        const data = await res.json();

        if (data && data.success && data.data) {
            const product = data.data;
            const metaTitle = product.meta_title || `${product.name} | Silkcurator`;
            const metaDesc = product.meta_description || product.description?.substring(0, 160) || '';
            const metaKeywords = product.meta_keywords || '';
            // Extract the primary image URL in a robust way
            let primaryImage = '';
            if (product.media?.primary_image) {
                primaryImage = product.media.primary_image.startsWith('http') ? product.media.primary_image : `${IMAGE_BASE}${product.media.primary_image}`;
            } else if (product.media?.primary) {
                primaryImage = product.media.primary.startsWith('http') ? product.media.primary : `${IMAGE_BASE}${product.media.primary}`;
            } else if (product.media?.gallery_images?.[0]) {
                primaryImage = product.media.gallery_images[0].startsWith('http') ? product.media.gallery_images[0] : `${IMAGE_BASE}${product.media.gallery_images[0]}`;
            } else if (product.media?.gallery?.[0]) {
                primaryImage = product.media.gallery[0].startsWith('http') ? product.media.gallery[0] : `${IMAGE_BASE}${product.media.gallery[0]}`;
            } else if (product.image_url) {
                primaryImage = product.image_url.startsWith('http') ? product.image_url : `${IMAGE_BASE}${product.image_url}`;
            } else if (product.image) {
                primaryImage = product.image.startsWith('http') ? product.image : `${IMAGE_BASE}${product.image}`;
            } else if (product.media?.images?.[0]) {
                primaryImage = product.media.images[0].startsWith('http') ? product.media.images[0] : `${IMAGE_BASE}${product.media.images[0]}`;
            }

            // Map local addresses to the production domain so WhatsApp can scrape the image during local testing
            if (primaryImage) {
                primaryImage = primaryImage.replace('http://localhost:5000', 'https://api.silkcurator.com');
                primaryImage = primaryImage.replace('http://localhost:3000', 'https://www.silkcurator.com');
            }

            return {
                title: metaTitle,
                description: metaDesc,
                keywords: metaKeywords,
                authors: [{ name: 'Silkcurator' }],
                robots: 'index, follow',
                alternates: {
                    canonical: `https://www.silkcurator.com/products/${slug}`,
                },
                openGraph: {
                    title: metaTitle,
                    description: metaDesc,
                    url: `https://www.silkcurator.com/products/${slug}`,
                    siteName: 'Silkcurator',
                    images: primaryImage ? [{ url: primaryImage, width: 800, height: 600, alt: metaTitle }] : [],
                    locale: 'en_IN',
                    type: 'website',
                },
                twitter: {
                    card: 'summary_large_image',
                    title: metaTitle,
                    description: metaDesc,
                    images: primaryImage ? [primaryImage] : [],
                },
                other: {
                    'title': metaTitle,
                    'revisit-after': '2 days',
                }
            };
        }
    } catch (e) {
        console.error("Error fetching product metadata:", e);
    }

    return {
        title: 'Product Not Found | Silkcurator',
    };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    // Await params to comply with Next.js 15/16 dynamic route requirements
    await params;
    return <ProductDetailsClient />;
}
