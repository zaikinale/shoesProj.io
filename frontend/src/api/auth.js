import { BASE_OPTIONS } from '../utils/apiBase.js'

const BASE_URL = 'http://localhost:3000/api/auth';

export async function login(email, password) {
    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        ...BASE_OPTIONS, 
        body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
    }
    
    const data = await response.json();
    return { user: data.user };
}

export async function register(username, email, password) {
    const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        ...BASE_OPTIONS,
        body: JSON.stringify({ username, email, password })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
    }
    
    const data = await response.json();
    return { user: data.user };
}

export async function getMe() {
    const response = await fetch(`${BASE_URL}/me`, {
        method: 'GET',
        ...BASE_OPTIONS 
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch user');
    }
    
    return response.json();
}

export async function logout() {
    const response = await fetch(`${BASE_URL}/logout`, {
        method: 'POST',
        ...BASE_OPTIONS
    });
    
    if (!response.ok) {
        throw new Error('Logout failed');
    }
    
    return true;
}

export async function refresh() {
    const response = await fetch(`${BASE_URL}/refresh`, {
        method: 'POST',
        ...BASE_OPTIONS
    });
    
    if (!response.ok) {
        throw new Error('Token refresh failed');
    }
    
    return response.json();
}