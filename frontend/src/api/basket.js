import { BASE_OPTIONS, BASE_URL as API_BASE } from '../utils/apiBase.js';

const BASE = API_BASE.endsWith('/') ? API_BASE : `${API_BASE}/`;
const BASE_URL = `${BASE}auth`;

export async function getBasket() {
    const response = await fetch(BASE_URL, {
        method: 'GET',
        ...BASE_OPTIONS
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch basket');
    }
    return response.json();
}

export async function deleteBasket() {
    const response = await fetch(`${BASE_URL}/clear`, {
        method: 'DELETE',
        ...BASE_OPTIONS
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch on delete basket');
    }
    return response.json();
}

export async function addGood(goodId) {
    const response = await fetch(`${BASE_URL}/add-good`, {
        method: 'POST',
        ...BASE_OPTIONS,
        body: JSON.stringify({ goodId })
    })

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch add good in basket');
    }
    return response.json();
}

export async function changeQuantityGoods(id, quantity) {
    const response = await fetch(`${BASE_URL}/update-good/${id}`, {
        method: 'PUT',
        ...BASE_OPTIONS,
        body: JSON.stringify({ quantity })
    })

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch on change quantity good in basket');
    }
    return response.json();
}

export async function deleteGood(id) {
    const response = await fetch(`${BASE_URL}/delete-good/${id}`, {
        method: 'DELETE',
        ...BASE_OPTIONS,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete from basket');
    }

    return { success: true };
}