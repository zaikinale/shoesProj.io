import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import NavigateTo from '../utils/navBtn.jsx';

export default function Order() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Необходима авторизация');

                const response = await fetch(`http://localhost:3000/api/orders/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.error || 'Ошибка загрузки заказа');
                }

                const data = await response.json();
                setOrder(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) return <div className="page-loader">Загрузка данных заказа...</div>;
    if (error) return (
        <div className="error-container">
            <h2>Ошибка</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/orders')} className="btn-primary">Вернуться к списку</button>
        </div>
    );
    if (!order) return <div className="error-container">Заказ не найден</div>;

    const formattedDate = new Date(order.createdAt).toLocaleString('ru-RU', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const statusConfig = {
        created: { label: 'Создан', color: '#3b82f6' },      // Синий
        processing: { label: 'В обработке', color: '#f59e0b' }, // Оранжевый
        shipped: { label: 'Отправлен', color: '#8b5cf6' },     // Фиолетовый
        delivered: { label: 'Доставлен', color: '#10b981' },   // Зеленый
        cancelled: { label: 'Отменен', color: '#ef4444' }      // Красный
    };

    const currentStatus = statusConfig[order.status] || { label: order.status, color: '#9ca3af' };

    // Подсчет общей суммы
    const totalAmount = order.items.reduce((sum, item) => {
        return sum + (item.good?.price || 0) * item.quantity;
    }, 0);

    const handleCancelOrder = async () => {
        if (!window.confirm('Вы уверены, что хотите отменить этот заказ?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3000/api/orders/${id}/cancel`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                alert('Заказ успешно отменен');
                setOrder({ ...order, status: 'cancelled' }); // Обновляем локально
            } else {
                const err = await res.json();
                alert(err.error || 'Не удалось отменить заказ');
            }
        } catch (e) {
            alert('Ошибка сети');
        }
    };

    return (
        <section className="orders">
            <header className="head">
                <div className="controls">
                    <NavigateTo path="orders" />
                    <div className="controls">
                        <h1>Заказ №{order.id}</h1>
                        <div className="status-badge" style={{color: currentStatus.color }}>
                            {currentStatus.label}
                        </div>
                    </div>
                </div>
            </header>

            <main className="body">
                <div className="head">
                    <div className="controls">
                        <span className="label">Дата оформления:</span>
                        <span className="value">{formattedDate}</span>
                    </div>
                    {/*<div className="controls">*/}
                    {/*    <span className="label">ID пользователя:</span>*/}
                    {/*    <span className="value">{order.userId}</span>*/}
                    {/*</div>*/}
                </div>

                <h2 className="section-title">Состав заказа</h2>
                <div className="container">
                    {order.items.map((item) => (
                        <div key={item.id} className="card">
                            <div className="img">
                                {item.good?.image ? (
                                    <img src={item.good.image} alt={item.good.title} className="img" />
                                ) : (
                                    <div className="no-image">Нет фото</div>
                                )}
                            </div>
                            <div className="product-details">
                                <h3 className="product-title">{item.good?.title || 'Товар удален'}</h3>
                                <p className="product-desc">{item.good?.description || '-'}</p>
                                <span className="qty-badge">{`Количество ${item.quantity}`}</span>
                                <div className="product-price-block">
                                    <span className="price-per-item">{item.good?.price} ₽ / шт.</span>
                                    <br/>
                                    <span className="total-item-price">{`Итоговая сумма: ${(item.good?.price || 0) * item.quantity} ₽`}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="head">
                    <div className="controls">
                        <span>Итоговая сумма: </span>
                        <span>{totalAmount} ₽</span>
                    </div>

                    <div className="controls">
                        {order.status === 'created' && (
                            <button onClick={handleCancelOrder} className="btn-danger">
                                Отменить заказ
                            </button>
                        )}
                        <Link to="/orders" className="btn-secondary">
                            К списку заказов
                        </Link>
                    </div>
                </div>
            </main>
        </section>
    );
}