import { useState, useEffect, useCallback } from 'react';
import { getOrdersUser, getOrdersManager } from '../api/orders.js';

export const useOrders = (userRole) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadOrders = useCallback(async () => {
        if (!userRole) return;
        
        try {
            setLoading(true);
            setError(null);
            
            const isAdmin = userRole === 2 || userRole === 3;
            const data = isAdmin ? await getOrdersManager() : await getOrdersUser();
            
            setOrders(data || []);
        } catch (err) {
            console.error('Error loading orders:', err);
            setError(err.message || 'Ошибка при загрузке заказов');
        } finally {
            setLoading(false);
        }
    }, [userRole]);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    return {
        orders,
        loading,
        error,
        isAdmin: userRole === 2 || userRole === 3,
        refresh: loadOrders
    };
};