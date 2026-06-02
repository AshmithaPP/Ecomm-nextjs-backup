"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useHomeStore } from '@/store/homeStore';
import { useCartStore } from '@/store/cartStore';
import { resolveMediaUrl } from '@/config/api';
import { useRouter } from 'next/navigation';
import './customerFavorites.css';

const CustomerFavorites = () => {
    const { favorites, favoritesLoading, favoritesError, fetchFavorites } = useHomeStore();
    const { addToCart, setDrawerOpen } = useCartStore();
    const router = useRouter();
    
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
    const manuallyPaused = useRef<{ [key: string]: boolean }>({});
    
    const [playingStates, setPlayingStates] = useState<{ [key: string]: boolean }>({});
    const [isAddingToCart, setIsAddingToCart] = useState<{ [key: string]: boolean }>({});
    const [failedVideos, setFailedVideos] = useState<{ [key: string]: boolean }>({});
    
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    // Initial fetch on mount
    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    // Handle viewport intersection observation for muted autoplay
    useEffect(() => {
        if (favoritesLoading || favorites.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5 // Play when card is 50% in view
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const videoId = entry.target.getAttribute('data-video-id');
                const videoEl = entry.target as HTMLVideoElement;

                if (!videoId || !videoEl) return;

                // If user manually stopped this specific video, respect their choice
                if (manuallyPaused.current[videoId]) {
                    return;
                }

                if (entry.isIntersecting) {
                    videoEl.play()
                        .then(() => {
                            setPlayingStates(prev => ({ ...prev, [videoId]: true }));
                        })
                        .catch((err) => {
                            console.log(`Autoplay blocked on video ${videoId}:`, err.message);
                        });
                } else {
                    videoEl.pause();
                    setPlayingStates(prev => ({ ...prev, [videoId]: false }));
                }
            });
        }, observerOptions);

        // Register all observed video elements
        Object.values(videoRefs.current).forEach((videoEl) => {
            if (videoEl) {
                observer.observe(videoEl);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, [favorites, favoritesLoading]);

    // Handle scroll position detection to show/hide arrows
    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowLeftArrow(scrollLeft > 10);
        setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    };

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;
        const scrollAmount = 300;
        const container = scrollContainerRef.current;
        if (direction === 'left') {
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Toggle play/pause state when clicking the video container
    const handleVideoClick = (videoId: string) => {
        const videoEl = videoRefs.current[videoId];
        if (!videoEl) return;

        if (videoEl.paused) {
            manuallyPaused.current[videoId] = false;
            videoEl.play()
                .then(() => {
                    setPlayingStates(prev => ({ ...prev, [videoId]: true }));
                })
                .catch(err => console.log(err));
        } else {
            manuallyPaused.current[videoId] = true;
            videoEl.pause();
            setPlayingStates(prev => ({ ...prev, [videoId]: false }));
        }
    };

    const handleVideoPlay = (videoId: string) => {
        manuallyPaused.current[videoId] = false;
        setPlayingStates(prev => ({ ...prev, [videoId]: true }));
    };

    const handleVideoPause = (videoId: string) => {
        manuallyPaused.current[videoId] = true;
        setPlayingStates(prev => ({ ...prev, [videoId]: false }));
    };

    // Trigger item additions in global cartStore
    const handleAddToCart = async (e: React.MouseEvent, product: any) => {
        e.stopPropagation();
        if (!product || isAddingToCart[product.id]) return;

        setIsAddingToCart(prev => ({ ...prev, [product.id]: true }));
        try {
            // Cart store addToCart(productId, variantId, quantity)
            // Passes empty string for variantId to fallback to product default in store
            const result = await addToCart(product.id, "", 1);
            if (result?.success) {
                setDrawerOpen(true);
            }
        } catch (err) {
            console.error("Storefront Add to Cart error:", err);
        } finally {
            setIsAddingToCart(prev => ({ ...prev, [product.id]: false }));
        }
    };

    // Direct routing to slug URL
    const handleViewProduct = (e: React.MouseEvent, slug: string) => {
        e.stopPropagation();
        if (!slug) return;
        router.push(`/collections/products/${slug}`);
    };

    // 1. Shimmer Screen Loading State
    if (favoritesLoading) {
        return (
            <section className="customer-favorites-section">
                <div className="container">
                    <div className="favorites-header">
                        <h2 className="favorites-title">Customer Favorites</h2>
                        <p className="favorites-subtitle">See what our community loves</p>
                    </div>
                    <div className="favorites-carousel-relative">
                        <div className="favorites-scroll-container">
                            {[1, 2, 3, 4, 5].map((idx) => (
                                <div key={idx} className="skeleton-video-card">
                                    <div className="skeleton-shimmer-bg"></div>
                                    <div className="skeleton-caption"></div>
                                    <div className="skeleton-caption-short"></div>
                                    <div className="skeleton-pill"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Hide section entirely if error occurs or no videos exist
    if (favoritesError || favorites.length === 0) {
        return null;
    }

    return (
        <section className="customer-favorites-section">
            <div className="container">
                <div className="favorites-header">
                    <h2 className="favorites-title">Customer Favorites</h2>
                    <p className="favorites-subtitle">See what our community loves</p>
                </div>

                <div className="favorites-carousel-relative">
                    {/* Left Scroll Navigation Button */}
                    {showLeftArrow && (
                        <button 
                            className="favorites-nav-arrow arrow-left" 
                            onClick={() => scroll('left')}
                            aria-label="Scroll left"
                        >
                            <i className="bi bi-chevron-left" style={{ fontSize: '20px', fontWeight: 'bold' }}></i>
                        </button>
                    )}

                    {/* Horizontal Videos Row */}
                    <div 
                        className="favorites-scroll-container" 
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                    >
                        {favorites.map((fav: any) => {
                            const isPlaying = playingStates[fav.video_id] || false;
                            const hasVideoFailed = failedVideos[fav.video_id] || false;
                            
                            return (
                                <div 
                                    key={fav.video_id} 
                                    className="favorite-video-card"
                                    onClick={() => handleVideoClick(fav.video_id)}
                                >
                                    {/* Conditionally render Video or fallback Poster Image */}
                                    {hasVideoFailed ? (
                                        <img
                                            src={resolveMediaUrl(fav.thumbnail_url)}
                                            alt={fav.title || "Saree Model"}
                                            className="favorite-video-element"
                                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                        />
                                    ) : (
                                        <video
                                            ref={el => { videoRefs.current[fav.video_id] = el; }}
                                            data-video-id={fav.video_id}
                                            src={resolveMediaUrl(fav.video_url)}
                                            poster={resolveMediaUrl(fav.thumbnail_url)}
                                            className="favorite-video-element"
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            preload="auto"
                                            controls
                                            onClick={(event) => event.stopPropagation()}
                                            onPlay={() => handleVideoPlay(fav.video_id)}
                                            onPause={() => handleVideoPause(fav.video_id)}
                                            onError={() => {
                                                setFailedVideos(prev => ({ ...prev, [fav.video_id]: true }));
                                            }}
                                        />
                                    )}

                                    {/* Semi-transparent dark background layer */}
                                    <div className="video-card-gradient" />

                                    {/* Floating play/pause indicator icons on hover */}
                                    <div className={`play-pause-indicator ${!isPlaying ? 'is-paused' : ''}`}>
                                        <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'} play-pause-icon`}></i>
                                    </div>

                                    {/* Testimonial Caption Text */}
                                    {fav.title && (
                                        <div className="video-caption">
                                            {fav.title}
                                        </div>
                                    )}

                                    {/* Floating Product Action Overlay pill */}
                                    {fav.product && (
                                        <div className="favorite-product-overlay" onClick={(e) => e.stopPropagation()}>
                                            {/* Product circular image on the left */}
                                            <div className="favorite-product-img-wrapper">
                                                <img 
                                                    src={resolveMediaUrl(fav.product.image)} 
                                                    alt={fav.product.name} 
                                                    className="favorite-product-img" 
                                                />
                                            </div>

                                            {/* View button in the middle */}
                                            <button 
                                                className="fav-btn-view"
                                                onClick={(e) => handleViewProduct(e, fav.product.slug || fav.product.id)}
                                            >
                                                VIEW
                                            </button>

                                            {/* Add to Cart button on the right */}
                                            <button 
                                                className="fav-btn-cart"
                                                onClick={(e) => handleAddToCart(e, fav.product)}
                                                disabled={isAddingToCart[fav.product.id]}
                                            >
                                                {isAddingToCart[fav.product.id] ? (
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ width: '10px', height: '10px' }}></span>
                                                ) : (
                                                    'ADD TO CART'
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Scroll Navigation Button */}
                    {showRightArrow && (
                        <button 
                            className="favorites-nav-arrow arrow-right" 
                            onClick={() => scroll('right')}
                            aria-label="Scroll right"
                        >
                            <i className="bi bi-chevron-right" style={{ fontSize: '20px', fontWeight: 'bold' }}></i>
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CustomerFavorites;
