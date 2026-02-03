const BASE_URL = 'http://localhost:3000/api/orders';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function getOrdersManager() {
    const response = await fetch(BASE_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        }
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
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        }
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
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
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
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        }
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
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        }
    })

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch add order');
    }
    return response.json();
}