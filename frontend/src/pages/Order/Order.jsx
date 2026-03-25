// import { useState, useEffect } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import NavigateTo from '../utils/navBtn.jsx';
// import { getOrderById, cancelOrder } from '../api/orders.js';

// export default function Order() {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [order, setOrder] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchOrder = async () => {
//             try {
//                 const data = await getOrderById(id);
//                 setOrder(data);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchOrder();
//     }, [id]);

//     if (loading) return <div className="page-loader">Loading order data...</div>;
//     if (error) return (
//         <div className="error-container">
//             <h2>Error</h2>
//             <p>{error}</p>
//             <button onClick={() => navigate('/orders')} className="btn-primary">Back to list</button>
//         </div>
//     );
//     if (!order) return <div className="error-container">Order not found</div>;

//     const formattedDate = new Date(order.createdAt).toLocaleString('ru-RU', {
//         year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
//     });

//     const statusConfig = {
//         created: { label: 'Created', color: '#3b82f6' },
//         processing: { label: 'In processing', color: '#f59e0b' },
//         shipped: { label: 'Sent', color: '#8b5cf6' },
//         delivered: { label: 'Delivered', color: '#10b981' },
//         cancelled: { label: 'Canceled', color: '#ef4444' }
//     };

//     const currentStatus = statusConfig[order.status] || { label: order.status, color: '#9ca3af' };

//     const totalAmount = order.items.reduce((sum, item) => {
//         return sum + (item.good?.price || 0) * item.quantity;
//     }, 0);

//     const handleCancelOrder = async () => {
//         if (!window.confirm('Are you sure you want to cancel this order?')) return;

//         try {
//             await cancelOrder(id);
//             alert('Order successfully canceled');
//             setOrder({ ...order, status: 'cancelled' });
//         } catch (e) {
//             alert(e.message || 'Network error');
//         }
//     };

//     return (
//         <section className="orders">
//             <header className="head">
//                 <div className="controls">
//                     <NavigateTo path="orders" />
//                     <div className="controls">
//                         <h2>Order №{order.id}</h2>
//                         <div className="status-badge" style={{color: currentStatus.color }}>
//                             {currentStatus.label}
//                         </div>
//                     </div>
//                 </div>
//             </header>

//             <main className="container">
//                 <div className="head">
//                     <div className="controls">
//                         <span className="label">Date:</span>
//                         <span className="value">{formattedDate}</span>
//                     </div>
//                 </div>

//                 <h2 className="section-title">Order list</h2>
//                 <div className="container">
//                     {order.items.map((item) => (
//                         <div key={item.id} className="card">
//                             <div className="img">
//                                 {item.good?.image ? (
//                                     <img src={item.good.image} alt={item.good.title} className="img" />
//                                 ) : (
//                                     <div className="no-image">No image</div>
//                                 )}
//                             </div>
//                             <div className="product-details">
//                                 <h3 className="product-title">{item.good?.title || 'Товар удален'}</h3>
//                                 <p className="product-desc">{item.good?.description || '-'}</p>
//                                 <span className="qty-badge">{`Count ${item.quantity}`}</span>
//                                 <div className="product-price-block">
//                                     <span className="price-per-item">{item.good?.price} ₽ / шт.</span>
//                                     <br/>
//                                     <span className="total-item-price">{`Total sum: ${(item.good?.price || 0) * item.quantity} ₽`}</span>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 <div className="head">
//                     <div className="controls">
//                         <span>Total sum: </span>
//                         <span>{totalAmount} ₽</span>
//                     </div>

//                     <div className="controls">
//                         {order.status === 'created' && (
//                             <button onClick={handleCancelOrder} className="btn-danger">
//                                 Cancel order
//                             </button>
//                         )}
//                         <Link to="/orders" className="btn-secondary">
//                             Go to orders
//                         </Link>
//                     </div>
//                 </div>
//             </main>
//         </section>
//     );
// }

import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOrder } from '../../hooks/useOrder.js';
import NavigateTo from '../../utils/navBtn.jsx';
import styles from './Order.module.css';

export default function Order() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Вся логика теперь здесь
    const { 
        order, 
        loading, 
        error, 
        totalAmount, 
        formattedDate, 
        handleCancelOrder 
    } = useOrder(id);

    if (loading) return <div className={styles.loader}>Загрузка данных...</div>;
    
    if (error || !order) return (
        <div className={styles.errorContainer}>
            <h2>{error || 'Заказ не найден'}</h2>
            <button onClick={() => navigate('/orders')} className={styles.btnSecondary}>
                Назад к списку
            </button>
        </div>
    );

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <div className={styles.navGroup}>
                        <NavigateTo path="orders" />
                        <span className={styles.orderId}>№{String(id).slice(-6).toUpperCase()}</span>
                    </div>
                    <nav className={styles.nav}>
                        <NavigateTo path="store" />
                        <NavigateTo path="basket" />
                        <NavigateTo path="profile" />
                    </nav>
                </div>
            </header>

            <main className={styles.container}>
                <div className={styles.layout}>
                    {/* ТОВАРЫ */}
                    <section className={styles.mainContent}>
                        <h1 className={styles.title}>Состав заказа</h1>
                        <div className={styles.itemsList}>
                            {order.items.map((item) => (
                                <div key={item.id} className={styles.itemCard}>
                                    <div className={styles.itemImage}>
                                        <img src={item.good?.image} alt={item.good?.title} />
                                    </div>
                                    <div className={styles.itemInfo}>
                                        <h3 className={styles.itemTitle}>{item.good?.title || 'Товар удален'}</h3>
                                        <p className={styles.itemDesc}>{item.good?.description}</p>
                                        <div className={styles.itemMeta}>
                                            <span className={styles.itemQty}>{item.quantity} шт.</span>
                                            <span className={styles.itemPrice}>{item.good?.price} ₽ / шт.</span>
                                        </div>
                                    </div>
                                    <div className={styles.itemTotal}>
                                        {(item.good?.price || 0) * item.quantity} ₽
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* САЙДБАР С ИНФО */}
                    <aside className={styles.sidebar}>
                        <div className={styles.summaryCard}>
                            <div className={`${styles.statusBadge} ${styles[`status--${order.status}`]}`}>
                                {order.status}
                            </div>
                            
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Дата оформления</span>
                                <span className={styles.infoValue}>{formattedDate}</span>
                            </div>
                            
                            <div className={styles.divider} />
                            
                            <div className={styles.totalRow}>
                                <span>Сумма заказа</span>
                                <span className={styles.totalValue}>{totalAmount} ₽</span>
                            </div>

                            <div className={styles.actions}>
                                {order.status === 'created' && (
                                    <button onClick={handleCancelOrder} className={styles.btnDanger}>
                                        Отменить заказ
                                    </button>
                                )}
                                <Link to="/orders" className={styles.btnSecondary}>
                                    К списку заказов
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}