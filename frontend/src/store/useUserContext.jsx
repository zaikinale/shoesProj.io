import { create } from 'zustand';
import { buildUrl, BASE_OPTIONS } from '../utils/apiBase.js';

export const useStore = create((set, get) => ({
    user: null,            
    isInitialized: false,   

    login: (userData) => {
        set({
            user: userData,
            isInitialized: true
        });
    },

    logout: async () => {
        try {
            await fetch(buildUrl('auth/logout'), {
                method: 'POST',
                ...BASE_OPTIONS
            });
        } catch (error) {
            console.error('Logout error:', error);
        }

        set({
            user: null,
            isInitialized: true
        });
    },

    restoreAuth: async () => {
        try {
            const response = await fetch(buildUrl('auth/me'), {
                method: 'GET',
                ...BASE_OPTIONS
            });

            if (response.ok) {
                const userData = await response.json();
                set({ 
                    user: userData, 
                    isInitialized: true 
                });
            } else {
                set({ 
                    user: null, 
                    isInitialized: true 
                });
            }
        } catch (error) {
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                console.warn('Network error during auth restore');
            } else {
                console.error('Auth restoration error:', error);
            }
            
            set({ 
                user: null, 
                isInitialized: true 
            });
        }
    }
}));