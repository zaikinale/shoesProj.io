import { BASE_OPTIONS, buildUrl } from '../utils/apiBase.js';

const BASE_URL = buildUrl('saves');

export async function getSavedGoods() {
    const response = await fetch(BASE_URL, {
        method: 'GET',
        ...BASE_OPTIONS
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch saved goods');
    }
    return response.json();
}

export async function checkIfSaved(goodId) {
    const response = await fetch(`${BASE_URL}/check/${goodId}`, {
        method: 'GET',
        ...BASE_OPTIONS
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to check save status');
    }
    const data = await response.json();
    return data.isSaved;
}

export async function saveGood(goodId) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        ...BASE_OPTIONS,
        body: JSON.stringify({ goodId })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save good');
    }
    return response.json();
}

export async function removeSavedGood(goodId) {
    const response = await fetch(`${BASE_URL}/${goodId}`, {
        method: 'DELETE',
        ...BASE_OPTIONS
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove saved good');
    }
    return response.json();
}