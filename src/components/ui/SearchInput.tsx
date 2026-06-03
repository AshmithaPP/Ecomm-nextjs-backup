"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './SearchInput.module.css';

interface SearchInputProps {
    placeholder?: string;
    defaultValue?: string;
    value?: string;
    onChange?: (value: string) => void;
    onSearch?: (value: string) => void;
    className?: string;
}

const SearchInput = ({
    placeholder = "Search...",
    defaultValue = "",
    value,
    onChange,
    onSearch,
    className = ""
}: SearchInputProps) => {
    const [inputValue, setInputValue] = useState(value !== undefined ? value : defaultValue);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (value !== undefined) {
            setInputValue(value);
        }
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);
        if (onChange) {
            onChange(val);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (onSearch) {
                onSearch(inputValue);
            }
        }
    };

    const handleClear = () => {
        setInputValue("");
        if (onChange) {
            onChange("");
        }
        if (onSearch) {
            onSearch("");
        }
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div className={`${styles.searchWrapper} ${isFocused ? styles.focused : ''} ${className}`}>
            <span className={styles.searchIconWrapper}>
                <i className="bi bi-search"></i>
            </span>
            <input
                ref={inputRef}
                type="text"
                className={styles.searchInput}
                placeholder={placeholder}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
            {inputValue && (
                <button type="button" className={styles.clearBtn} onClick={handleClear} aria-label="Clear search">
                    <i className="bi bi-x" style={{ fontSize: '20px', fontWeight: 'bold' }}></i>
                </button>
            )}
        </div>
    );
};

export default SearchInput;
