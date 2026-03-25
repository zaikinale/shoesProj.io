import { useState, useEffect, useCallback } from 'react';
import { getSavedGoods } from '../api/saves.js';

export const useSaves = () => {
    const [savedGoods, setSavedGoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadGoods = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getSavedGoods();
            setSavedGoods(data || []);
        } catch (err) {
            console.error('Error loading saves:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadGoods();
    }, [loadGoods]);

    return {
        savedGoods,
        loading,
        error,
        refresh: loadGoods
    };
};