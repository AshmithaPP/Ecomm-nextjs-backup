"use client";

import React, { useEffect } from 'react';
import NewsletterSection from 'features/home/components/NewsletterSection/NewsletterSection';
import BlogSection from 'features/home/components/BlogSection/BlogSection';
import ContactHero from 'features/contact/components/ContactHero/ContactHero';
import { useBlogStore } from '@/store/blogStore';

const BlogPage = () => {
    const { hero, fetchBlogs } = useBlogStore();

    useEffect(() => {
        // Trigger blogs fetch to fetch settings dynamically
        fetchBlogs({ page: 1, limit: 10 });
    }, [fetchBlogs]);

    return (
        <div className="blog-page">
            <ContactHero 
                overTitle={hero?.over_title}
                title={hero?.title}
                subtitle={hero?.subtitle}
                buttonText={hero?.button_text}
                imageUrl={hero?.image_url}
            />
            <BlogSection showTitle={true} />
            <NewsletterSection />
        </div>
    );
};

export default BlogPage;
