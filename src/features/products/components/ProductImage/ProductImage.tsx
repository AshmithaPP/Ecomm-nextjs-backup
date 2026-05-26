"use client";
import React, { useState } from 'react';
import './productImage.css';
import { resolveMediaUrl } from '@/config/api';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';

const ProductImage = ({ media, video, product }: any) => {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated } = useAuthStore();
    const { items: wishlistItems, toggleWishlist } = useWishlistStore();
    const isLiked = isAuthenticated && wishlistItems.some((item: any) => item.product_id === product?.product_id);

    // Support both variant format (gallery / primary) and main product format (gallery_images / primary_image)
    let galleryImages: string[] = [];
    if (media?.gallery && Array.isArray(media.gallery) && media.gallery.length > 0) {
        galleryImages = media.gallery;
    } else if (media?.gallery_images && Array.isArray(media.gallery_images) && media.gallery_images.length > 0) {
        galleryImages = media.gallery_images;
    } else {
        const primary = media?.primary || media?.primary_image || '';
        galleryImages = [primary];
    }

    // Resolve all image URLs
    const resolvedGalleryImages = galleryImages
        .filter(Boolean)
        .map(url => resolveMediaUrl(url));

    // Combine images and video into a single items array
    const items = [...resolvedGalleryImages.map((url: string) => ({ type: 'image', url }))];
    if (video) {
        items.push({ type: 'video', url: resolveMediaUrl(video) });
    }

    const [activeIndex, setActiveIndex] = useState(0);
    const activeItem = items[activeIndex];

    return (
        <div className="product-gallery-layout d-flex gap-3">
            {/* Left: Vertical Thumbnails */}
            <div className="thumbnail-vertical-column d-flex flex-column gap-2">
                {items.map((item: any, index: number) => (
                    <div
                        key={index}
                        className={`thumbnail-item ${activeIndex === index ? 'active' : ''}`}
                        onClick={() => setActiveIndex(index)}
                    >
                        {item.type === 'image' ? (
                            <img src={item.url} alt={`Thumb ${index}`} />
                        ) : (
                            <div className="video-thumb-overlay">
                                <i className="bi bi-play-circle-fill"></i>
                                <img src={resolvedGalleryImages[0] || ''} alt="Video Thumb" className="video-thumb-bg" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Right: Main Image Area */}
            <div className="main-image-display position-relative flex-grow-1">
                {activeItem?.type === 'video' ? (
                    <video
                        src={activeItem.url}
                        className="main-display-media"
                        controls
                        autoPlay
                        muted
                    />
                ) : activeItem?.type === 'image' && activeItem.url ? (
                    <img src={activeItem.url} alt="Product" className="main-display-media" />
                ) : (
                    <div className="main-display-media placeholder">
                        <span>No Media Available</span>
                    </div>
                )}

                {/* Wishlist/Share Icons */}
                <div className="image-action-overlay">
                    <button 
                        className="image-action-btn gallery-share-btn" 
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!product) return;
                            const liveUrl = typeof window !== 'undefined'
                                ? `https://www.silkcurator.com${window.location.pathname}`
                                : `https://www.silkcurator.com/collections/products/${product.slug || ''}`;

                            const currentPrice = product.selected_variant?.price || product.price;
                            const discountPercent = currentPrice?.mrp && parseFloat(currentPrice.mrp) > parseFloat(currentPrice.selling_price)
                                ? Math.round(((parseFloat(currentPrice.mrp) - parseFloat(currentPrice.selling_price)) / parseFloat(currentPrice.mrp)) * 100)
                                : 0;

                            const discountText = discountPercent > 0 
                                ? `Get up to ${discountPercent}% OFF on this item!`
                                : `Get the best price on ${product.name}!`;

                            const message = `Hey, check out this product on ${product.brand || 'our store'}:

${product.name}

${discountText}

${liveUrl}`;

                            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
                            window.open(whatsappUrl, "_blank");
                        }}
                        aria-label="Share"
                    >
                        <i className="bi bi-share"></i>
                    </button>
                    <button 
                        className={`image-action-btn gallery-wishlist-btn`} 
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!isAuthenticated) {
                                router.push(`/login?redirect=${pathname}`);
                                return;
                            }
                            if (product?.product_id) {
                                toggleWishlist(product.product_id);
                            }
                        }}
                        aria-label="Add to Wishlist"
                    >
                        <i className={`bi ${isLiked ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>
                    </button>
                </div>

                {activeItem?.type === 'image' && (
                    <button className="zoom-indicator-btn">
                        <i className="bi bi-search"></i>
                        <span>Hover to Zoom</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductImage;
