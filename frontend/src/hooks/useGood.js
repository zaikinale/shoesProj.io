import { useState, useEffect, useCallback } from 'react';

import * as goodsApi from '../api/goods';
import * as catApi from '../api/categories';
import * as saveApi from '../api/saves';
import * as basketApi from '../api/basket';

export const useGood = (id) => {
    const [good, setGood] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadGoodData = useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            const goodData = await goodsApi.getGoodById(Number(id));
            setGood(goodData);

            const cats = await catApi.getCategoriesByGoodId(goodData.id);
            setCategories(cats);
            console.log(goodData)
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { loadGoodData(); }, [loadGoodData]);

    const toggleSave = async () => {
        if (!good) return;
        
        const prevStatus = good.isSaved ?? false;

        try {
            setGood(prev => ({ ...prev, isSaved: !prevStatus }));

            if (prevStatus) await saveApi.removeSavedGood(good.id);
            else await saveApi.saveGood(good.id);
        } catch (err) {
            setGood(prev => ({ ...prev, isSaved: prevStatus }));
            alert("Ошибка при сохранении");
            console.error(err);
        }
    };

    const addToBasket = async () => {
        if (!good) return;
        try {
            await basketApi.addGood(Number(good.id));
            setGood(prev => ({ ...prev, isInBasket: true }));
        } catch (err) { 
            alert("Ошибка при добавлении в корзину"); 
            console.error(err);
        }
    };

    const isSaved = good?.isSaved ?? false;

    return { good, categories, isSaved, loading, toggleSave, addToBasket };
};