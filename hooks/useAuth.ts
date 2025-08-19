/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import axios from 'axios';

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'customer';
    phone?: string;
    avatar?: string;
    address?: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
}

interface AuthStore {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (userData: RegisterData) => Promise<boolean>;
    logout: () => void;
    updateProfile: (userData: Partial<User>) => Promise<boolean>;
    checkAuth: () => Promise<void>;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone?: string;
}

export const useAuth = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isLoading: false,

            login: async (email, password) => {
                set({ isLoading: true });
                try {
                    const response = await axios.post('/api/auth/login', { email, password });
                    const { user, token } = response.data;

                    set({ user, token, isLoading: false });

                    // Set axios default header
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                    toast.success(`Welcome back, ${user.name}!`);
                    return true;
                } catch (error: any) {
                    set({ isLoading: false });
                    toast.error(error.response?.data?.message || 'Login failed');
                    return false;
                }
            },

            register: async (userData) => {
                set({ isLoading: true });
                try {
                    const response = await axios.post('/api/auth/register', userData);
                    const { user, token } = response.data;

                    set({ user, token, isLoading: false });

                    // Set axios default header
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                    toast.success(`Welcome to GearNset, ${user.name}!`);
                    return true;
                } catch (error: any) {
                    set({ isLoading: false });
                    toast.error(error.response?.data?.message || 'Registration failed');
                    return false;
                }
            },

            logout: () => {
                set({ user: null, token: null });
                delete axios.defaults.headers.common['Authorization'];
                toast.success('Logged out successfully');
            },

            updateProfile: async (userData) => {
                set({ isLoading: true });
                try {
                    const response = await axios.put('/api/auth/profile', userData);
                    const { user } = response.data;

                    set({ user, isLoading: false });
                    toast.success('Profile updated successfully');
                    return true;
                } catch (error: any) {
                    set({ isLoading: false });
                    toast.error(error.response?.data?.message || 'Profile update failed');
                    return false;
                }
            },

            checkAuth: async () => {
                const token = get().token;
                if (!token) return;

                try {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const response = await axios.get('/api/auth/me');
                    const { user } = response.data;
                    set({ user });
                } catch (error) {
                    set({ user: null, token: null });
                    delete axios.defaults.headers.common['Authorization'];
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
            }),
        }
    )
);
