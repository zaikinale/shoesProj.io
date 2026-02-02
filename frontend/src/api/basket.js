const BASE_URL = 'http://localhost:3000/api/basket';


const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function getBasket() {
    const response = await fetch(BASE_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        }
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
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        }
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
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
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
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
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
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
    })

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch on change quantity good in basket');
    }
    return response.json();
}