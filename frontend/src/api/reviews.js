const BASE_URL = 'http://localhost:3000/api/reviews';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// GET /api/reviews/check/:goodId
export async function checkIfReviewed(goodId) {
    const response = await fetch(`${BASE_URL}/check/${goodId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to check review status');
    }
    const data = await response.json();
    return data.hasReviewed;
}

// POST /api/reviews
export async function createReview(goodId, text, rating, image = null) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify({ goodId, text, rating, image })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create review');
    }
    return response.json();
}

// GET /api/reviews/:goodId
export async function getReviewsByGoodId(goodId) {
    const response = await fetch(`${BASE_URL}/${goodId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch reviews');
    }
    return response.json();
}









