const BASE_URL = 'http://localhost:3000/api/goods';

const BASE_OPTIONS = {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
};

export async function getGoodById(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'GET',
        ...BASE_OPTIONS
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch good');
    }
    return response.json();
}

export async function getGoods() {
    const response = await fetch(BASE_URL, {
        method: 'GET',
        ...BASE_OPTIONS
    });
    
    if (!response.ok) throw new Error('Failed to fetch goods');
    return response.json();
}

export async function addGood(data) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        ...BASE_OPTIONS,
        body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Failed to add good');
    return response.json();
}

export async function updateGood(id, data) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        ...BASE_OPTIONS,
        body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Failed to update good');
    return response.json();
}

export async function deleteGood(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        ...BASE_OPTIONS
    });
    
    if (!response.ok) throw new Error('Failed to delete good');
}