import { useState, useEffect, useCallback } from 'react';
import { getGoods } from "../api/goods.js";
import { getCategories } from "../api/categories.js";

export const useStoreData = (isInitialized, user) => {
    const [goods, setGoods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [goodsData, catsData] = await Promise.all([getGoods(), getCategories()]);
            setGoods(goodsData);
            setCategories(catsData);
        } catch (e) {
            console.error("Data loading error:", e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isInitialized) {
            loadData();
        }
    }, [isInitialized, user, loadData]);

    return { goods, categories, isLoading, refresh: loadData };
};