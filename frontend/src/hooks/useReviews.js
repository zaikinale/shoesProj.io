import { useState, useEffect, useCallback } from 'react';
import * as reviewApi from '../api/reviews';

export const useReviews = (goodId) => {
    const [reviews, setReviews] = useState([]);
    const [hasReviewed, setHasReviewed] = useState(false);

    const loadReviews = useCallback(async () => {
        if (!goodId) return;
        try {
            const [data, status] = await Promise.all([
                reviewApi.getReviewsByGoodId(goodId),
                reviewApi.checkIfReviewed(goodId).catch(() => true)
            ]);
            setReviews(data);
            setHasReviewed(status);
        } catch (err) { console.error(err); }
    }, [goodId]);

    useEffect(() => { loadReviews(); }, [loadReviews]);

    const submitReview = async (text, rating, image) => {
        await reviewApi.createReview(goodId, text, rating, image);
        setHasReviewed(true);
        const updated = await reviewApi.getReviewsByGoodId(goodId);
        setReviews(updated);
    };

    const avgRating = reviews.length > 0 
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : "—";

    return { reviews, hasReviewed, submitReview, avgRating };
};