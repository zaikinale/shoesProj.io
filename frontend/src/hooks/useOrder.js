import { useState, useEffect, useCallback } from 'react';
import { getOrderById, cancelOrder as apiCancelOrder } from '../api/orders.js';

export const useOrder = (id) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrder = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getOrderById(id);
            setOrder(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchOrder();
    }, [id, fetchOrder]);

    const handleCancelOrder = async () => {
        if (!window.confirm('Отменить этот заказ?')) return false;
        try {
            await apiCancelOrder(id);
            setOrder((prev) => ({ ...prev, status: 'cancelled' }));
            return true;
        } catch (e) {
            alert(e.message || 'Ошибка сети');
            return false;
        }
    };

    const totalAmount =
        order?.items?.reduce((sum, item) => {
            return sum + (item.good?.price || 0) * item.quantity;
        }, 0) || 0;

    const formattedDate = order?.createdAt
        ? new Date(order.createdAt).toLocaleString('ru-RU', {
              day: 'numeric',
              month: 'long',
              hour: '2-digit',
              minute: '2-digit',
          })
        : '';

    return {
        order,
        loading,
        error,
        totalAmount,
        formattedDate,
        handleCancelOrder,
        refresh: fetchOrder,
    };
};
