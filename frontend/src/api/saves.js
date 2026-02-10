const BASE_URL = 'http://localhost:3000/api/saves';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// GET /api/saves
export async function getSavedGoods() {
    const response = await fetch(BASE_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch saved goods');
    }
    return response.json();
}

// GET /api/saves/check/:goodId
export async function checkIfSaved(goodId) {
    const response = await fetch(`${BASE_URL}/check/${goodId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to check save status');
    }
    const data = await response.json();
    return data.isSaved;
}

// POST /api/saves
export async function saveGood(goodId) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify({ goodId })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save good');
    }
    return response.json();
}

// DELETE /api/saves/:goodId 
export async function removeSavedGood(goodId) {
    const response = await fetch(`${BASE_URL}/${goodId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove saved good');
    }
    return response.json();
}