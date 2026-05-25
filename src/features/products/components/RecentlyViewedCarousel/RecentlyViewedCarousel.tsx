"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore';
import ProductCard from 'features/products/components/ProductCard/ProductCard';
import ArrowButton from 'components/common/ArrowButton';
import './recentlyViewedCarousel.css';

const RecentlyViewedCarousel = () => {
    const { recentlyViewed, loading, error, fetchRecentlyViewed } = useRecentlyViewedStore();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Initial fetch on mount
    useEffect(() => {
        fetchRecentlyViewed();
    }, [fetchRecentlyViewed]);

    // Handle horizontal scroll limits detection for Arrow buttons
    const checkScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 5);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    };

    const handleScroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const scrollAmount = 300;
        const offset = direction === 'left' ? -scrollAmount : scrollAmount;
        scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    };

    useEffect(() => {
        const currentRef = scrollRef.current;
        if (currentRef) {
            currentRef.addEventListener('scroll', checkScroll);
            // Dynamic evaluation check
            setTimeout(checkScroll, 200);
        }
        return () => {
            if (currentRef) currentRef.removeEventListener('scroll', checkScroll);
        };
    }, [recentlyViewed, loading]);

    // 1. Shimmer Skeleton Loading State
    if (loading) {
        return (
            <div className="recently-viewed-section my-2 justify-content-center">
                <h3 className="section-title mb-4 text-center">Recently Viewed Products</h3>
                <div className="related-carousel-wrapper position-relative">
                    <div className="related-products-track">
                        {[1, 2, 3, 4].map((idx) => (
                            <div key={idx} className="related-product-card">
                                <div className="rv-skeleton-card">
                                    <div className="rv-skeleton-img"></div>
                                    <div className="rv-skeleton-title"></div>
                                    <div className="rv-skeleton-price"></div>
                                    <div className="rv-skeleton-button"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Hide entire section if error occurs or no items exist
    if (error || recentlyViewed.length === 0) {
        return null;
    }

    return (
        <div className="recently-viewed-section my-2 justify-content-center">
            <h3 className="section-title mb-4 text-center">Recently Viewed Products</h3>
            
            <div className="related-carousel-wrapper position-relative">
                {/* Left Scroll Navigation Button */}
                <div className="carousel-arrow arrow-left">
                    <ArrowButton
                        direction="left"
                        onClick={() => handleScroll('left')}
                        disabled={!canScrollLeft}
                    />
                </div>

                {/* Scrollable Track */}
                <div className="related-products-track" ref={scrollRef} onScroll={checkScroll}>
                    {recentlyViewed.map((item: any) => (
                        <div className="related-product-card" key={item.recently_viewed_id}>
                            <ProductCard product={{
                                ...item,
                                title: item.name,
                                image: item.image,
                                price: item.price,
                                originalPrice: item.mrp,
                                rating: { average: item.rating.value, count: item.rating.count },
                                stock_status: item.stock_status
                            }} />
                        </div>
                    ))}
                </div>

                {/* Right Scroll Navigation Button */}
                <div className="carousel-arrow arrow-right">
                    <ArrowButton
                        direction="right"
                        onClick={() => handleScroll('right')}
                        disabled={!canScrollRight}
                    />
                </div>
            </div>
        </div>
    );
};

export default RecentlyViewedCarousel;
