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
            {/* ── CARD (image + overlays only) ── */}
            <div className={styles.productCard}>
                <div className={styles.imageWrapper}>
                    {imageUrl && (
                        typeof imageUrl === 'string' ? (
                            <img src={imageUrl} alt={displayTitle} className={styles.productImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <Image src={imageUrl} alt={displayTitle} className={styles.productImage} width={287} height={369} />
                        )
                    )}

                    {discount && (
                        <div
                            className={styles.discountBadge}
                            style={{ backgroundColor: discountBg || '#10B981' }}
                        >
                            {discount}
                        </div>
                    )}

                    <div className={styles.wishlistContainer}>
                        <WishlistButton product={product} />
                    </div>

                    <AddToCartButton
                        product={product}
                        classes={{
                            container: styles.qtyOverlay,
                            qtySelector: styles.qtySelectorCol,
                            qtyBtn: styles.qtyOverlayBtn,
                            qtyVal: styles.qtyOverlayVal,
                            addBtn: styles.btnOverlayAddToCart
                        }}
                    />
                </div>
            </div>

            {/* ── TEXT & PRICE — separately below the card ── */}
            <div className={styles.productInfo}>
                <h4 className={styles.productTitle}>{displayTitle}</h4>
                <div className={styles.productPriceContainerNew}>
                    <div className={styles.productPriceRowNew}>
                        <span className={styles.priceLabelMrp}>MRP</span>
                        {!isNaN(originalPriceNum) && originalPriceNum > priceNum ? (
                            <span className={styles.priceOriginalStrike}>₹{Math.round(originalPriceNum).toLocaleString('en-IN')}</span>
                        ) : null}
                        <span className={styles.priceCurrentBold}>₹{Math.round(priceNum).toLocaleString('en-IN')}</span>
                        <span className={styles.priceInfoIconNew} title="Inclusive of all taxes">ⓘ</span>
                    </div>
                 
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

