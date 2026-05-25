"use client";

import React, { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'react-toastify';

interface AddToCartButtonProps {
    product: any;
    classes: {
        container?: string;
        qtySelector?: string;
        qtyBtn?: string;
        qtyVal?: string;
        addBtn?: string;
    };
}

const AddToCartButton = ({ product, classes }: AddToCartButtonProps) => {
    const { cart, addToCart, updateQuantity, removeFromCart, setDrawerOpen } = useCartStore();
    const [isAdding, setIsAdding] = useState(false);
    const [isUpdatingQty, setIsUpdatingQty] = useState(false);
    const [qtyToSelect, setQtyToSelect] = useState(1);

    const rawId = product.product_id || product.id || (product.product && (product.product.product_id || product.product.id));
    const pid = (typeof rawId === 'object' && rawId !== null) ? (rawId.id || rawId.product_id) : rawId;

    const cartItems = cart?.items || [];
    const existingCartItem = cartItems.find((item: any) => item.product_id === pid || item.product_id === Number(pid));
    
    const isOutOfStock = product.stock_status === 'out_of_stock' || product.stockStatus === 'out_of_stock' || product.stock_status === 'sold_out';

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isOutOfStock || isAdding || isUpdatingQty) return;

        const variantId = product.variant_id || product.default_variant_id || (product.variants && product.variants[0]?.variant_id) || null;
        const productIdToSend = (typeof pid === 'string' && !isNaN(pid as any)) ? Number(pid) : pid;

        setIsAdding(true);
        try {
            const result = await addToCart(productIdToSend, variantId, existingCartItem ? 1 : qtyToSelect);
            if (result?.success) {
                toast.success('Added to cart!');
                setDrawerOpen(true);
            } else {
                toast.error(result?.message || 'Failed to add to cart');
            }
        } finally {
            setIsAdding(false);
        }
    };

    const handleDecreaseQty = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isAdding || isUpdatingQty) return;

        if (existingCartItem) {
            setIsUpdatingQty(true);
            try {
                if (existingCartItem.quantity > 1) {
                    await updateQuantity(existingCartItem.cart_item_id, existingCartItem.quantity - 1);
                } else {
                    await removeFromCart(existingCartItem.cart_item_id);
                }
            } finally {
                setIsUpdatingQty(false);
            }
        } else {
            setQtyToSelect(prev => Math.max(1, prev - 1));
        }
    };

    const handleIncreaseQty = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isAdding || isUpdatingQty) return;

        if (existingCartItem) {
            setIsUpdatingQty(true);
            try {
                if (existingCartItem.quantity < 10) {
                    await updateQuantity(existingCartItem.cart_item_id, existingCartItem.quantity + 1);
                } else {
                    toast.warning("Maximum limit of 10 reached", { position: "top-right" });
                }
            } finally {
                setIsUpdatingQty(false);
            }
        } else {
            setQtyToSelect(prev => Math.min(10, prev + 1));
        }
    };

    return (
        <div className={classes.container} onClick={(e) => e.stopPropagation()}>
            <div className={classes.qtySelector}>
                <button 
                    type="button"
                    className={classes.qtyBtn}
                    onClick={handleDecreaseQty}
                    disabled={isAdding || isUpdatingQty || (!existingCartItem && qtyToSelect <= 1)}
                >
                    −
                </button>
                <span className={classes.qtyVal}>
                    {isUpdatingQty ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ width: '12px', height: '12px', color: '#1D3328' }}></span>
                    ) : (
                        existingCartItem ? existingCartItem.quantity : qtyToSelect
                    )}
                </span>
                <button 
                    type="button"
                    className={classes.qtyBtn}
                    onClick={handleIncreaseQty}
                    disabled={isAdding || isUpdatingQty || (existingCartItem ? existingCartItem.quantity >= 10 : qtyToSelect >= 10)}
                >
                    +
                </button>
            </div>
            <button 
                className={classes.addBtn}
                onClick={handleAddToCart}
                disabled={isAdding || isUpdatingQty}
            >
                {isAdding ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                    'ADD TO CART'
                )}
            </button>
        </div>
    );
};

export default AddToCartButton;
