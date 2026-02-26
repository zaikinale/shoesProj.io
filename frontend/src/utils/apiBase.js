const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/'

export const BASE_OPTIONS = {
    headers: { 
        'Content-Type': 'application/json' 
    },
    credentials: 'include'
};

export { BASE_URL }