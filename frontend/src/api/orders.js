import { BASE_OPTIONS, BASE_URL as API_BASE } from '../utils/apiBase.js';

const BASE = API_BASE.endsWith('/') ? API_BASE : `${API_BASE}/`;
const BASE_URL = `${BASE}auth`;

export async function getOrdersManager() {
    const response = await fetch(BASE_URL, {
        method: 'GET',
        ...BASE_OPTIONS
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch orders manager');
    }
    return response.json();
}

export async function getOrdersUser() {
    const response = await fetch(`${BASE_URL}/my`, {
        method: 'GET',
        ...BASE_OPTIONS
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch order user');
    }
    return response.json();
}

export async function changeStatusOrder(id, status) {
    const response = await fetch(`${BASE_URL}/${id}/status`, {
        method: 'PUT',
        ...BASE_OPTIONS,
        body: JSON.stringify({ status })
    })

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch on change status order');
    }
    return response.json();
}

export async function cancelOrder(id) {
    const response = await fetch(`${BASE_URL}/${id}/cancel`, {
        method: 'DELETE',
        ...BASE_OPTIONS
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch on cancel order');
    }
    return response.json();
}

export async function createOrder() {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        ...BASE_OPTIONS
    })

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch add order');
    }
    return response.json();
}

export async function getOrderById(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'GET',
        ...BASE_OPTIONS
    })

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch find order by id');
    }
    return response.json();
}