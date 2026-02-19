// import { create } from "zustand";
//
// export const useStore = create((set) => ({
//     user: null,
//     setUser: (user) => set({ user }),
//     clearUser: () => set({ user: null }),
// }));

import { create } from "zustand";

const getInitialToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
};

export const useStore = create((set, get) => ({
    user: null,
    token: getInitialToken(),
    isInitialized: false,

    login: (token, userData) => {
        localStorage.setItem('token', token);
        set({
            token,
            user: userData,
            isInitialized: true
        });
    },

    logout: () => {
        localStorage.removeItem('token');
        set({
            user: null,
            token: null,
            isInitialized: true
        });
    },

    setUser: (user) => set({ user }),

    clearUser: () => set({ user: null }),

    restoreAuth: async () => {
        const token = get().token;

        if (!token) {
            set({ isInitialized: true });
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/auth/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const userData = await response.json();
                set({
                    user: userData,
                    isInitialized: true
                });
            } else {
                console.warn('Invalid token, clearing session');
                get().logout();
            }
        } catch (error) {
            console.error('Auth restoration error:', error);
            get().logout();
        }
    }
}));