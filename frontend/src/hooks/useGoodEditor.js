import { useState, useEffect, useCallback } from 'react';
import * as goodsApi from '../api/goods.js';
import * as catApi from '../api/categories.js';

export const useGoodEditor = (id) => {
    const [good, setGood] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const isEditMode = !!id;

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [categoriesData, goodData] = await Promise.all([
                catApi.getCategories(),
                isEditMode ? goodsApi.getGoodById(Number(id)) : Promise.resolve(null)
            ]);

            setCategories(categoriesData);

            if (isEditMode && goodData) {
                setGood({
                    ...goodData,
                    categoryIds: goodData.categories?.map(c => c.id) || []
                });
            } else {
                setGood({
                    title: '',
                    description: '',
                    price: '',
                    image: '',
                    isActive: true,
                    categoryIds: [],
                    images: []
                });
            }
        } catch (err) {
            console.error("Editor load error:", err);
        } finally {
            setLoading(false);
        }
    }, [id, isEditMode]);

    useEffect(() => { loadData(); }, [loadData]);

    const save = async (payload) => {
        if (isEditMode) {
            return await goodsApi.updateGood(Number(id), payload);
        } else {
            return await goodsApi.addGood(payload);
        }
    };

    return { good, setGood, categories, loading, isEditMode, save };
};