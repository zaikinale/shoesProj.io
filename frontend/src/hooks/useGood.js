import { useState, useEffect, useCallback } from 'react';
import * as goodsApi from '../api/goods';
import * as catApi from '../api/categories';
import * as saveApi from '../api/saves';
import * as basketApi from '../api/basket';

export const useGood = (id) => {
    const [good, setGood] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadGoodData = useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            const goodData = await goodsApi.getGoodById(Number(id));
            setGood(goodData);

            const [cats, saveStatus] = await Promise.all([
                catApi.getCategoriesByGoodId(goodData.id),
                saveApi.checkIfSaved(goodData.id).catch(() => false)
            ]);

            setCategories(cats);
            setIsSaved(saveStatus);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { loadGoodData(); }, [loadGoodData]);

    const toggleSave = async () => {
        if (!good) return;
        try {
            if (isSaved) await saveApi.removeSavedGood(good.id);
            else await saveApi.saveGood(good.id);
            setIsSaved(!isSaved);
        } catch (err) { 
            alert("Ошибка при сохранении");
            console.log(err) 
        }
    };

    const addToBasket = async () => {
        if (!good) return;
        try {
            await basketApi.addGood(Number(good.id));
            setGood(prev => ({ ...prev, isInBasket: true }));
        } catch (err) { 
            alert("Ошибка при добавлении в корзину"); 
            console.log(err)
        }
    };

    return { good, categories, isSaved, loading, toggleSave, addToBasket };
};