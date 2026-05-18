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
            const primaryImage = product.media?.images?.[0] ? `${IMAGE_BASE}${product.media.images[0]}` : '';

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
                    images: primaryImage ? [{ url: primaryImage }] : [],
                    locale: 'en_IN',
                    type: 'website',
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
