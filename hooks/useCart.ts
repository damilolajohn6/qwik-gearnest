'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    variant?: string;
    slug?: string;
    category?: string;
    maxQuantity?: number;
}

interface CartStore {
    items: CartItem[];
    totalItems: number;
    totalAmount: number;
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getItem: (id: string) => CartItem | undefined;
    applyDiscount: (code: string) => boolean;
    removeDiscount: () => void;
    calculateShipping: (address?: any) => number;
    getCartSummary: () => {
        subtotal: number;
        tax: number;
        shipping: number;
        discount: number;
        total: number;
    };
}

const calculateTotals = (items: CartItem[]) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return { totalItems, subtotal };
};

// Mock discount codes
const discountCodes: Record<string, { percentage: number; minAmount: number }> = {
    'WELCOME10': { percentage: 10, minAmount: 50 },
    'SAVE20': { percentage: 20, minAmount: 100 },
    'FREESHIP': { percentage: 0, minAmount: 75 },
};

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            totalItems: 0,
            totalAmount: 0,
            subtotal: 0,
            tax: 0,
            shipping: 0,
            discount: 0,

            addItem: (newItem) => {
                const items = get().items;
                const existingItem = items.find(item => item.id === newItem.id);

                let updatedItems: CartItem[];

                if (existingItem) {
                    const newQuantity = existingItem.quantity + (newItem.quantity || 1);
                    const maxQuantity = existingItem.maxQuantity || 10;
                    
                    if (newQuantity > maxQuantity) {
                        toast.error(`Maximum ${maxQuantity} items allowed for this product`);
                        return;
                    }

                    updatedItems = items.map(item =>
                        item.id === newItem.id
                            ? { ...item, quantity: newQuantity }
                            : item
                    );
                    toast.success('Item quantity updated in cart');
                } else {
                    const cartItem: CartItem = {
                        ...newItem,
                        quantity: newItem.quantity || 1,
                        maxQuantity: newItem.maxQuantity || 10,
                    };
                    updatedItems = [...items, cartItem];
                    toast.success('Item added to cart');
                }

                const { totalItems, subtotal } = calculateTotals(updatedItems);
                const tax = subtotal * 0.08; // 8% tax
                const shipping = subtotal >= 75 ? 0 : 9.99; // Free shipping over $75
                const totalAmount = subtotal + tax + shipping - get().discount;

                set({ 
                    items: updatedItems, 
                    totalItems, 
                    subtotal,
                    tax,
                    shipping,
                    totalAmount 
                });
            },

            removeItem: (id) => {
                const items = get().items;
                const updatedItems = items.filter(item => item.id !== id);
                const { totalItems, subtotal } = calculateTotals(updatedItems);
                const tax = subtotal * 0.08;
                const shipping = subtotal >= 75 ? 0 : 9.99;
                const totalAmount = subtotal + tax + shipping - get().discount;

                set({ 
                    items: updatedItems, 
                    totalItems, 
                    subtotal,
                    tax,
                    shipping,
                    totalAmount 
                });
                toast.success('Item removed from cart');
            },

            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(id);
                    return;
                }

                const items = get().items;
                const item = items.find(item => item.id === id);
                
                if (item && item.maxQuantity && quantity > item.maxQuantity) {
                    toast.error(`Maximum ${item.maxQuantity} items allowed for this product`);
                    return;
                }

                const updatedItems = items.map(item =>
                    item.id === id ? { ...item, quantity } : item
                );
                const { totalItems, subtotal } = calculateTotals(updatedItems);
                const tax = subtotal * 0.08;
                const shipping = subtotal >= 75 ? 0 : 9.99;
                const totalAmount = subtotal + tax + shipping - get().discount;

                set({ 
                    items: updatedItems, 
                    totalItems, 
                    subtotal,
                    tax,
                    shipping,
                    totalAmount 
                });
            },

            clearCart: () => {
                set({ 
                    items: [], 
                    totalItems: 0, 
                    totalAmount: 0,
                    subtotal: 0,
                    tax: 0,
                    shipping: 0,
                    discount: 0
                });
                toast.success('Cart cleared');
            },

            getItem: (id) => {
                return get().items.find(item => item.id === id);
            },

            applyDiscount: (code) => {
                const discount = discountCodes[code.toUpperCase()];
                if (!discount) {
                    toast.error('Invalid discount code');
                    return false;
                }

                const { subtotal } = get();
                if (subtotal < discount.minAmount) {
                    toast.error(`Minimum order of $${discount.minAmount} required`);
                    return false;
                }

                const discountAmount = discount.percentage > 0 
                    ? subtotal * (discount.percentage / 100)
                    : get().shipping;

                set({ discount: discountAmount });
                
                const { totalItems, subtotal: newSubtotal } = calculateTotals(get().items);
                const tax = newSubtotal * 0.08;
                const shipping = discount.percentage === 0 ? 0 : (newSubtotal >= 75 ? 0 : 9.99);
                const totalAmount = newSubtotal + tax + shipping - discountAmount;

                set({ 
                    totalItems, 
                    subtotal: newSubtotal,
                    tax,
                    shipping,
                    totalAmount 
                });

                toast.success(`Discount applied! ${discount.percentage > 0 ? `${discount.percentage}% off` : 'Free shipping'}`);
                return true;
            },

            removeDiscount: () => {
                const { totalItems, subtotal } = calculateTotals(get().items);
                const tax = subtotal * 0.08;
                const shipping = subtotal >= 75 ? 0 : 9.99;
                const totalAmount = subtotal + tax + shipping;

                set({ 
                    discount: 0,
                    totalItems, 
                    subtotal,
                    tax,
                    shipping,
                    totalAmount 
                });
                toast.success('Discount removed');
            },

            calculateShipping: (address) => {
                const { subtotal } = get();
                if (subtotal >= 75) return 0;
                
                // Mock shipping calculation based on address
                if (address?.country === 'US') {
                    return address?.state === 'CA' ? 5.99 : 9.99;
                }
                return 19.99; // International
            },

            getCartSummary: () => {
                const state = get();
                return {
                    subtotal: state.subtotal,
                    tax: state.tax,
                    shipping: state.shipping,
                    discount: state.discount,
                    total: state.totalAmount
                };
            },
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({
                items: state.items,
                totalItems: state.totalItems,
                totalAmount: state.totalAmount,
                subtotal: state.subtotal,
                tax: state.tax,
                shipping: state.shipping,
                discount: state.discount,
            }),
        }
    )
);