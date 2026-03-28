// Поддержка VITE_API_URL и устаревшего VITE_API_BACKEND из .env
const RAW_BASE_URL = (
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BACKEND ||
    'http://localhost:3000/api'
)
    .toString()
    .replace(/\/+$/, '');

/** Origin бэкенда без суффикса /api — для Socket.IO (тот же хост и порт, что и REST). */
export const getBackendOrigin = () => {
    const base = RAW_BASE_URL.replace(/\/+$/, '');
    if (base.endsWith('/api')) {
        return base.slice(0, -4);
    }
    return base;
};

export const buildUrl = (path) => {
    const base = `${RAW_BASE_URL}/`;
    
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    
    return `${base}${cleanPath}`;
};

export const BASE_OPTIONS = {
    headers: { 
        'Content-Type': 'application/json' 
    },
    credentials: 'include'
};