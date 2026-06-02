"use client";

import React from 'react';
import styles from './CategoryCard.module.css';

interface CategoryCardProps {
    title: string;
    count: string;
    imageUrl: any;
    buttonText?: string;
    onClick?: (title: string) => void;
}

const CategoryCard = ({ title, count, imageUrl, buttonText = "View Collections", onClick }: CategoryCardProps) => {
    const bgUrl = typeof imageUrl === 'string' ? imageUrl : imageUrl.src;

    return (
        <div
            className={styles.cardContainer}
            onClick={() => onClick && onClick(title)}
        >
            <img 
                src={bgUrl} 
                alt={title} 
                className={styles.bgImage} 
                onError={(e) => {
                    e.currentTarget.style.display = 'none'; // Gracefully hide broken browser image icons
                }}
            />
            <div className={styles.overlay}>
                <div className={styles.contentBox}>
                    <h3 className={styles.title}>{title}</h3>
                    <div className={styles.countBadge}>
                        <span className={styles.countText}>{count}</span>
                    </div>
                    <button className={styles.viewBtn}>
                        <span className={styles.btnText}>{buttonText}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryCard;