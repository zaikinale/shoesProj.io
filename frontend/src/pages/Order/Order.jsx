import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOrder } from '../../hooks/useOrder.js';
import NavigateTo from '../../utils/navBtn.jsx';
import styles from './Order.module.css';

export default function Order() {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        order,
        loading,
        error,
        totalAmount,
        formattedDate,
        handleCancelOrder,
    } = useOrder(id);

    if (loading) return <div className={styles.loader}>Загрузка данных...</div>;

    if (error || !order)
        return (
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
                    <section className={styles.mainContent}>
                        <h1 className={styles.title}>Состав заказа</h1>
                        <div className={styles.itemsList}>
                            {order.items.map((item) => (
                                <div key={item.id} className={styles.itemCard}>
                                    <div className={styles.itemImage}>
                                        <img src={item.good?.image} alt={item.good?.title} />
                                    </div>
                                    <div className={styles.itemInfo}>
                                        <h3 className={styles.itemTitle}>
                                            {item.good?.title || 'Товар удален'}
                                        </h3>
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

                    <aside className={styles.sidebar}>
                        <div className={styles.summaryCard}>
                            <div
                                className={`${styles.statusBadge} ${styles[`status--${order.status}`]}`}
                            >
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
