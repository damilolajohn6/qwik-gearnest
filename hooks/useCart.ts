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
}

interface CartStore {
    items: CartItem[];
    totalItems: number;
    totalAmount: number;
    addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getItem: (id: string) => CartItem | undefined;
}

const calculateTotals = (items: CartItem[]) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return { totalItems, totalAmount };
};

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            totalItems: 0,
            totalAmount: 0,

            addItem: (newItem) => {
                const items = get().items;
                const existingItem = items.find(item => item.id === newItem.id);

                let updatedItems: CartItem[];

                if (existingItem) {
                    updatedItems = items.map(item =>
                        item.id === newItem.id
                            ? { ...item, quantity: item.quantity + (newItem.quantity || 1) }
                            : item
                    );
                    toast.success('Item quantity updated in cart');
                } else {
                    const cartItem: CartItem = {
                        ...newItem,
                        quantity: newItem.quantity || 1,
                    };
                    updatedItems = [...items, cartItem];
                    toast.success('Item added to cart');
                }

                const { totalItems, totalAmount } = calculateTotals(updatedItems);
                set({ items: updatedItems, totalItems, totalAmount });
            },

            removeItem: (id) => {
                const items = get().items;
                const updatedItems = items.filter(item => item.id !== id);
                const { totalItems, totalAmount } = calculateTotals(updatedItems);
                set({ items: updatedItems, totalItems, totalAmount });
                toast.success('Item removed from cart');
            },

            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(id);
                    return;
                }

                const items = get().items;
                const updatedItems = items.map(item =>
                    item.id === id ? { ...item, quantity } : item
                );
                const { totalItems, totalAmount } = calculateTotals(updatedItems);
                set({ items: updatedItems, totalItems, totalAmount });
            },

            clearCart: () => {
                set({ items: [], totalItems: 0, totalAmount: 0 });
                toast.success('Cart cleared');
            },

            getItem: (id) => {
                return get().items.find(item => item.id === id);
            },
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({
                items: state.items,
                totalItems: state.totalItems,
                totalAmount: state.totalAmount,
            }),
        }
    )
);