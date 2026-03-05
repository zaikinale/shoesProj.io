// api/categories.js
import { BASE_OPTIONS, buildUrl } from '../utils/apiBase.js';

const BASE_URL = buildUrl('categories');

export async function getCategories() {
    const response = await fetch(BASE_URL, {
        method: 'GET',
        ...BASE_OPTIONS
    });
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
}

export async function getCategoryById(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'GET',
        ...BASE_OPTIONS
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch category');
    }
    return response.json();
}

export async function addCategory(data) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        ...BASE_OPTIONS,
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add category');
    }
    return response.json();
}

export async function updateCategory(id, data) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        ...BASE_OPTIONS,
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update category');
    }
    return response.json();
}

export async function deleteCategory(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        ...BASE_OPTIONS
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete category');
    }
}

export async function addGoodToCategory(categoryId, goodId) {
    const response = await fetch(`${BASE_URL}/${categoryId}/goods`, {
        method: 'POST',
        ...BASE_OPTIONS,
        body: JSON.stringify({ goodId })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add good to category');
    }
    return response.json();
}

export async function removeGoodFromCategory(categoryId, goodId) {
    const response = await fetch(`${BASE_URL}/${categoryId}/goods/${goodId}`, {
        method: 'DELETE',
        ...BASE_OPTIONS
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove good from category');
    }
}

export async function getGoodsByCategory(categoryId) {
    const response = await fetch(`${BASE_URL}/${categoryId}/goods`, {
        method: 'GET',
        ...BASE_OPTIONS
    });
    if (!response.ok) throw new Error('Failed to fetch goods by category');
    return response.json();
}