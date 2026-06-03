"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import './productGridCard.css';
import { useWishlistStore } from '@/store/wishlistStore';
import AddToCartButton from 'components/common/AddToCartButton';
import Image from 'next/image';
import { resolveMediaUrl } from '@/config/api';
import { useAuthStore } from '@/store/authStore';
import RatingStars from '@/components/ui/RatingStars/RatingStars';

interface ProductGridCardProps {
    product: any;
}

const ProductGridCard = ({ product }: ProductGridCardProps) => {
    const { 
        name, title, 
        price, originalPrice, 
        discount, image, image_url, 
        isBestSeller, id, product_id, slug, stockStatus, stock_status 
    } = product;
    
    const router = useRouter();
    const pathname = usePathname();
    const { toggleWishlist, isInWishlist } = useWishlistStore();
    const { isAuthenticated } = useAuthStore();
    const [imageLoaded, setImageLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    const rawId = product.product_id || product.id || (product.product && (product.product.product_id || product.product.id));
    const pid = (typeof rawId === 'object' && rawId !== null) ? (rawId.id || rawId.product_id) : rawId;
    
    const isLiked = isAuthenticated && isInWishlist(pid);
    const displayTitle = name || title;
    
    const displayPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price;
    const displayOriginalPrice = typeof originalPrice === 'string' ? parseFloat(originalPrice.replace(/[^0-9.]/g, '')) : originalPrice;
    const imageUrl = resolveMediaUrl(image_url || image);

    useEffect(() => {
        if (imgRef.current && imgRef.current.complete) {
            setImageLoaded(true);
        }
    }, [imageUrl]);

    // Resolve secondary image if available
    const gallery = product.media?.gallery_images || product.media?.gallery || product.gallery_images || product.gallery || [];
    const secondaryUrl = Array.isArray(gallery)
        ? gallery.find((url: string) => url && resolveMediaUrl(url) !== imageUrl)
        : null;
    const secondaryImageUrl = secondaryUrl ? resolveMediaUrl(secondaryUrl) : null;

    const isOutOfStock = stock_status === 'out_of_stock' || stockStatus === 'out_of_stock' || stock_status === 'sold_out';

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            router.push(`/login?redirect=${pathname}`);
            return;
        }
        toggleWishlist(product);
    };

    const handleNavigate = () => {
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
        <div className={`product-card ${secondaryImageUrl ? 'has-secondary' : ''}`} onClick={handleNavigate} style={{ cursor: 'pointer' }}>
            {/* Image Section */}
            <div className="product-image-container">
                {imageUrl && (
                    <img 
                        ref={imgRef}
                        src={imageUrl} 
                        alt={displayTitle} 
                        className={`product-image primary-image ${imageLoaded ? 'image-loaded' : ''}`} 
                        onLoad={() => setImageLoaded(true)}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                )}

                {secondaryImageUrl && (
                    <img 
                        src={secondaryImageUrl} 
                        alt={`${displayTitle} - Alternate View`} 
                        className="product-image secondary-image"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                )}

                {/* Best Seller Tag */}
                {isBestSeller && (
                    <div className="best-seller-tag">
                        <span className="best-seller-text">Best Seller</span>
                    </div>
                )}

                {/* Wishlist Button */}
                <button 
                    className={`wishlist-btn ${isLiked ? 'liked' : ''}`} 
                    aria-label="Add to wishlist"
                    onClick={handleWishlistToggle}
                >
                    <i className={`bi ${isLiked ? 'bi-heart-fill text-danger' : 'bi-heart'} wishlist-icon`}></i>
                </button>
            </div>

            {/* Content Section */}
            <div className="product-info">
                <div className="product-text-top">
                    <h3 className="product-name">{displayTitle}</h3>
                    {(product.brand || product.category?.name) && (
                        <p className="product-category-label">{product.brand || product.category?.name}</p>
                    )}
                </div>

                <div className="product-rating-row mb-2">
                    <RatingStars rating={product.rating?.average || 4} size="small" />
                    {product.rating?.count > 0 && (
                        <span className="rating-count-label text-muted ms-1">({product.rating.count})</span>
                    )}
                </div>

                <div className="product-price-container-new mb-3">
                    <div className="product-price-row-new">
                        <span className="price-label-mrp">MRP</span>
                        {displayOriginalPrice && displayOriginalPrice > displayPrice ? (
                            <span className="price-original-strike">₹{Math.round(displayOriginalPrice).toLocaleString('en-IN')}</span>
                        ) : null}
                        <span className="price-current-bold">₹{Math.round(displayPrice).toLocaleString('en-IN')}</span>
                        <span className="price-info-icon-new" title="Inclusive of all taxes">ⓘ</span>
                    </div>
                    <div className="price-taxes-label-new">
                        (incl. of all taxes)
                    </div>
                </div>

                {isOutOfStock ? (
                    <button className="btn-add-to-cart-v2 disabled" disabled style={{ pointerEvents: 'none' }}>
                        OUT OF STOCK
                    </button>
                ) : (
                    <AddToCartButton
                        product={product}
                        classes={{
                            container: "d-flex align-items-center gap-2 w-100",
                            qtySelector: "product-card-qty-selector-new",
                            qtyBtn: "product-card-qty-btn-new",
                            qtyVal: "product-card-qty-val-new",
                            addBtn: "btn-add-to-cart-new flex-grow-1"
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default ProductGridCard;

