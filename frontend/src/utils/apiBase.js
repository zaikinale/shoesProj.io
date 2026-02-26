const RAW_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const buildUrl = (path) => {
    const base = RAW_BASE_URL.endsWith('/') ? RAW_BASE_URL : `${RAW_BASE_URL}/`;
    
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    
    return `${base}${cleanPath}`;
};

export const BASE_OPTIONS = {
    headers: { 
        'Content-Type': 'application/json' 
    },
    credentials: 'include'
};