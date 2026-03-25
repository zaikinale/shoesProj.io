import { useState, useEffect, useCallback, useMemo } from 'react';
import { getBasket, deleteBasket } from '../api/basket.js';
import { createOrder } from '../api/orders.js';

export const useBasket = () => {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadBasket = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getBasket();
            setItems(data.items || []);
        } catch (error) {
            console.error('Basket load error:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadBasket();
    }, [loadBasket]);

    const totals = useMemo(() => {
        return items.reduce((acc, item) => {
            acc.count += item.quantity;
            acc.price += (item.good.price * item.quantity);
            return acc;
        }, { count: 0, price: 0 });
    }, [items]);

    const clear = async () => {
        try {
            await deleteBasket();
            setItems([]);
        } catch (e) {
            console.log(e)
            loadBasket();
        }
    };

    const checkout = async () => {
        try {
            await createOrder();
            setItems([]);
            return true;
        } catch (e) {
            console.log(e)
            return false;
        }
    };

    return { items, totals, isLoading, clear, checkout, refresh: loadBasket };
};