"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import WishlistButton from 'components/common/WishlistButton';
import AddToCartButton from 'components/common/AddToCartButton';
import styles from './ProductCard.module.css';
import { useAuthStore } from '@/store/authStore';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { resolveMediaUrl } from '@/config/api';

const ProductCard = ({ product }: { product: any }) => {
    const { title, name, image, image_url, discount, discountedPrice, price, originalPrice, original_price, discountBg, id, product_id, slug, stock_status } = product;
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    const rawId = product_id || id;
    const pid = (typeof rawId === 'object' && rawId !== null) ? (rawId.id || rawId.product_id) : rawId;
    
        const displayTitle = name || title;
    const imageUrl = resolveMediaUrl(image_url || image);
    
    const cleanPriceStr = discountedPrice || price || '';
    const cleanOriginalPriceStr = originalPrice || original_price || '';
    
    const priceNum = typeof cleanPriceStr === 'number' ? cleanPriceStr : parseFloat(String(cleanPriceStr).replace(/[^0-9.]/g, ''));
    const originalPriceNum = typeof cleanOriginalPriceStr === 'number' ? cleanOriginalPriceStr : parseFloat(String(cleanOriginalPriceStr).replace(/[^0-9.]/g, ''));

    const averageRating = product.rating?.average || product.rating || 0;
    const reviewsCount = product.rating?.count || product.reviews_count || 0;

    // Strictly bind to the API discount values and fallback if 0
    const apiDiscountPercentage = product.discount_percentage || (product.product && product.product.discount_percentage) || 0;
    let calculatedDiscount = "";
    if (apiDiscountPercentage > 0) {
        calculatedDiscount = `${apiDiscountPercentage}% OFF`;
    } else if (!isNaN(originalPriceNum) && !isNaN(priceNum) && originalPriceNum > priceNum) {
        const percentage = Math.round(((originalPriceNum - priceNum) / originalPriceNum) * 100);
        if (percentage > 0) {
            calculatedDiscount = `${percentage}% OFF`;
        }
    } else {
        calculatedDiscount = `0% OFF`;
    }

    const renderStars = (ratingVal: number) => {
        const stars = [];
        const roundedRating = Math.round(ratingVal);
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i 
                    key={i} 
                    className={`bi ${i <= roundedRating ? 'bi-star-fill' : 'bi-star'}`} 
                    style={{ color: i <= roundedRating ? '#DE3E6B' : '#E0E0E0', marginRight: '2px', fontSize: '13px' }}
                />
            );
        }
        return stars;
    };

    const handleCardClick = () => {
        const resolvedSlug = slug || (displayTitle
            ? displayTitle
                .toLowerCase()
                .trim()
                .replace(/['']/g, '')          // remove apostrophes
                .replace(/[^a-z0-9\s-]/g, '')  // strip remaining special chars
                .replace(/\s+/g, '-')           // spaces → hyphens
                .replace(/-+/g, '-')            // collapse double hyphens
                .replace(/^-|-$/g, '')          // trim edge hyphens
            : pid);
        router.push(`/collections/products/${resolvedSlug}`);
    };

    return (
        <div className={styles.cardItem} onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            <div className={styles.productCard}>
                {/* Image Section */}
                <div className={styles.imageWrapper}>
                    {imageUrl && (
                        typeof imageUrl === 'string' ? (
                            <img src={imageUrl} alt={displayTitle} className={styles.productImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <Image src={imageUrl} alt={displayTitle} className={styles.productImage} width={287} height={300} />
                        )
                    )}

                    <div className={styles.tagsContainer}>
                        {discount && (
                            <div className={styles.discountBadge}>
                                {discount}
                            </div>
                        )}
                    </div>

                    <div className={styles.wishlistContainer}>
                        <WishlistButton product={product} />
                    </div>
                </div>

                {/* Details Section inside the same card */}
                <div className={styles.productInfo}>
                    <div className={styles.productDetailsGroup}>
                        {/* 1. Rating stars and reviews count */}
                        <div className={styles.ratingRow}>
                            {renderStars(parseFloat(String(averageRating || 0)))}
                            <span className={styles.reviewsCount}>
                                {reviewsCount > 0 ? `${reviewsCount} reviews` : '0 reviews'}
                            </span>
                        </div>

                        {/* 2. Product title */}
                        <h4 className={styles.productTitle}>{displayTitle}</h4>

                        {/* 3. Product description */}
                        <p className={styles.productDescription}>
                            {product.description || 'Premium handcrafted quality Saree'}
                        </p>

                        {/* 4. Discount tag */}
                        <div className={styles.discountTagPill}>
                            {calculatedDiscount.toLowerCase().includes('off') 
                                ? `Upto ${calculatedDiscount}` 
                                : `${calculatedDiscount} OFF`}
                        </div>

                        {/* 5. Price & MRP Strikeout */}
                        <div className={styles.priceRow}>
                            <span className={styles.currentPrice}>₹{Math.round(priceNum).toLocaleString('en-IN')}</span>
                            {!isNaN(originalPriceNum) && originalPriceNum > priceNum && (
                                <span className={styles.originalPriceContainer}>
                                    <span className={styles.mrpLabel}>MRP</span>
                                    <span className={styles.originalPriceStrike}>₹{Math.round(originalPriceNum).toLocaleString('en-IN')}</span>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* 6. ADD TO CART Button - permanent at the bottom inside card */}
                    <div className={styles.cardBtnContainer} onClick={(e) => e.stopPropagation()}>
                        <AddToCartButton
                            product={product}
                            classes={{
                                container: "d-flex align-items-center gap-2 w-100",
                                qtySelector: styles.qtySelectorColNew,
                                qtyBtn: styles.qtyOverlayBtnNew,
                                qtyVal: styles.qtyOverlayValNew,
                                addBtn: styles.btnOverlayAddToCartNew
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

