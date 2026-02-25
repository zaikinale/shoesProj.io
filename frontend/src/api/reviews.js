const BASE_URL = 'http://localhost:3000/api/reviews';

const BASE_OPTIONS = {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
};

export async function checkIfReviewed(goodId) {
    const response = await fetch(`${BASE_URL}/check/${goodId}`, {
        method: 'GET',
        ...BASE_OPTIONS
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to check review status');
    }
    const data = await response.json();
    return data.hasReviewed;
}

export async function createReview(goodId, text, rating, image = null) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        ...BASE_OPTIONS,
        body: JSON.stringify({ goodId, text, rating, image })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create review');
    }
    return response.json();
}

export async function getReviewsByGoodId(goodId) {
    const response = await fetch(`${BASE_URL}/${goodId}`, {
        method: 'GET',
        ...BASE_OPTIONS
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch reviews');
    }
    return response.json();
}