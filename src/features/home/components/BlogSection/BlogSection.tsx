"use client";

import React, { useEffect } from 'react';
import BlogCard from './BlogCard';
import './blogSection.css';
import { resolveMediaUrl } from '@/config/api';
import { useBlogStore, BlogItem } from '@/store/blogStore';

interface BlogSectionProps {
    showTitle?: boolean;
    title?: string;
    customTitleClass?: string;
    dynamicBlogs?: BlogItem[];
}

const BlogSection = ({ showTitle = true, title = "Our Blogs", customTitleClass = "", dynamicBlogs }: BlogSectionProps) => {
  const { blogs: storeBlogs, fetchBlogs, loading } = useBlogStore();

  useEffect(() => {
    // Only fetch if we don't have dynamicBlogs, store is empty, and it's not currently loading
    if (!dynamicBlogs && storeBlogs.length === 0 && !loading) {
      fetchBlogs();
    }
  }, [dynamicBlogs, storeBlogs.length, loading, fetchBlogs]);

  const blogs = dynamicBlogs || storeBlogs;

  const getImageUrl = (image: any) => {
    if (!image) return '';
    if (typeof image !== 'string') return image;
    return resolveMediaUrl(image);
  };

  return (
    <section className="blog-section">
      <div className="container blog-container">
        {showTitle && <h2 className={`blog-section-title ${customTitleClass}`}>{title}</h2>}
        <div className="row g-4 justify-content-center">
          {blogs.map((blog: any) => (
            <div className="col-lg-4 col-md-6 col-12 d-flex justify-content-center" key={blog.blog_id || blog.id}>
              <BlogCard 
                id={blog.slug || blog.blog_id || blog.id}
                title={blog.title}
                category={blog.category}
                date={blog.published_date || blog.date}
                image={getImageUrl(blog.image_url || blog.image)} 
                description={blog.excerpt || blog.subtitle || (blog.content ? blog.content.substring(0, 100).replace(/<[^>]*>?/gm, '') + '...' : '')}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
