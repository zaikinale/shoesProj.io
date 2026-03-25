// import { create } from 'zustand';
// import { buildUrl, BASE_OPTIONS } from '../utils/apiBase.js';

// export const useStore = create((set, get) => ({
//     user: null,            
//     isInitialized: false,   

//     login: (userData) => {
//         set({
//             user: userData,
//             isInitialized: true
//         });
//     },

//     logout: async () => {
//         try {
//             await fetch(buildUrl('auth/logout'), {
//                 method: 'POST',
//                 ...BASE_OPTIONS
//             });
//         } catch (error) {
//             console.error('Logout error:', error);
//         }

//         set({
//             user: null,
//             isInitialized: true
//         });
//     },

//     restoreAuth: async () => {
//         try {
//             const response = await fetch(buildUrl('auth/me'), {
//                 method: 'GET',
//                 ...BASE_OPTIONS
//             });

//             if (response.ok) {
//                 const userData = await response.json();
//                 set({ 
//                     user: userData, 
//                     isInitialized: true 
//                 });
//             } else {
//                 set({ 
//                     user: null, 
//                     isInitialized: true 
//                 });
//             }
//         } catch (error) {
//             if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
//                 console.warn('Network error during auth restore');
//             } else {
//                 console.error('Auth restoration error:', error);
//             }
            
//             set({ 
//                 user: null, 
//                 isInitialized: true 
//             });
//         }
//     }
// }));
import { create } from 'zustand'; // <-- Добавь эту строку
import { buildUrl, BASE_OPTIONS } from '../utils/apiBase.js';

export const useStore = create((set, get) => ({
    user: null,            
    isInitialized: false,   
    
login: (userData) => {
    if (!userData) return;

    // Сохраняем токен сразу при вызове login
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
        // Сначала сбрасываем всё, чтобы интерфейс мгновенно отреагировал
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
        // Перед запросом можно не сбрасывать isInitialized, 
        // чтобы не показывать экран загрузки при каждом переходе, 
        // если App.js вызывает это один раз при старте.
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
            set({ user: null, isInitialized: true });
        }
    }
}));