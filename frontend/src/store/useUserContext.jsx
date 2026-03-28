import { create } from 'zustand';
import { buildUrl, BASE_OPTIONS } from '../utils/apiBase.js';

export const useStore = create((set, get) => ({
    user: null,            
    isInitialized: false,   

    /** После успешного PATCH /auth/profile — обновляем store из ответа API */
    setUserPublic: (userData) => {
        if (!userData) return;
        set({ user: userData });
    },
    
    login: (userData) => {
        if (!userData) return;

        const token = userData.token || userData.accessToken;
        if (token) {
            localStorage.setItem('token', token);
        }

        set({
            user: userData, 
            isInitialized: true 
        });
    },

    logout: async () => {
        set({ user: null, isInitialized: true });

        try {
            await fetch(buildUrl('auth/logout'), {
                method: 'POST',
                ...BASE_OPTIONS
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    },

    restoreAuth: async () => {
        try {
            const response = await fetch(buildUrl('auth/me'), {
                method: 'GET',
                ...BASE_OPTIONS
            });

            if (response.ok) {
                const userData = await response.json();
                set({ user: userData, isInitialized: true });
            } else {
                set({ user: null, isInitialized: true });
            }
        } catch (error) {
            console.log(error)
            set({ user: null, isInitialized: true });
        }
    }
}));