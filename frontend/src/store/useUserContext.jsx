import { create } from 'zustand';

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
            await fetch('http://localhost:3000/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
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
            const response = await fetch('http://localhost:3000/api/auth/me', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
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
            console.error('Auth restoration error:', error);
            set({ 
                user: null, 
                isInitialized: true 
            });
        }
    }
}));