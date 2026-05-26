"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import './productCard.css';
import { useWishlistStore } from '@/store/wishlistStore';
import AddToCartButton from 'components/common/AddToCartButton';
import Image from 'next/image';
import { resolveMediaUrl } from '@/config/api';
import { useAuthStore } from '@/store/authStore';
import RatingStars from '@/components/ui/RatingStars/RatingStars';

interface ProductCardProps {
    product: any;
}

const ProductCard = ({ product }: ProductCardProps) => {
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

    const rawId = product.product_id || product.id || (product.product && (product.product.product_id || product.product.id));
    const pid = (typeof rawId === 'object' && rawId !== null) ? (rawId.id || rawId.product_id) : rawId;
    
    const isLiked = isAuthenticated && isInWishlist(pid);
    const displayTitle = name || title;
    
    const displayPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price;
    const displayOriginalPrice = typeof originalPrice === 'string' ? parseFloat(originalPrice.replace(/[^0-9.]/g, '')) : originalPrice;
    const imageUrl = resolveMediaUrl(image_url || image);

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
        <div className="product-card" onClick={handleNavigate} style={{ cursor: 'pointer' }}>
            {/* Image Section */}
            <div className="product-image-container">
                {imageUrl && (
                    <img 
                        src={imageUrl} 
                        alt={displayTitle} 
                        className="product-image" 
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

export default ProductCard;

