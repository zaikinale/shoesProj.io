import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/categories.js';

export const useCategories = (id = null) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryGoods, setCategoryGoods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            if (id) {
                const data = await api.getCategoryById(Number(id));
                setSelectedCategory(data);
                setCategoryGoods(data.goods || []);
            } else {
                const data = await api.getCategories();
                setCategories(data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { loadData(); }, [loadData]);

    const deleteCat = async (catId) => {
        if (!window.confirm('Удалить категорию?')) return;
        try {
            await api.deleteCategory(catId);
            setCategories(prev => prev.filter(c => c.id !== catId));
        } catch (err) { setError(err.message); }
    };

    return { 
        categories, selectedCategory, categoryGoods, 
        loading, error, refresh: loadData, deleteCat 
    };
};