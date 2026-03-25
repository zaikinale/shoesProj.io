import { useStore } from '../../store/useUserContext.jsx';
import { useOrders } from '../../hooks/useOrders.js';
import OrderList from '../../components/OrderList/OrderList.jsx';
import NavigateTo from '../../utils/navBtn.jsx';
import styles from './Orders.module.css';

export default function Orders() {
    const userRole = useStore((state) => state.user?.roleID);
    
    const { orders, loading, error, isAdmin, refresh } = useOrders(userRole);

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <div className={styles.navGroup}>
                        <NavigateTo path="orders" />
                        <span className={styles.breadcrumb}>/ Заказы</span>
                    </div>
                    <nav className={styles.nav}>
                        <NavigateTo path="store" />
                        {!isAdmin && <NavigateTo path="basket" />}
                        <NavigateTo path="profile" />
                    </nav>
                </div>
            </header>

            <main className={styles.container}>
                <h1 className={styles.title}>
                    {isAdmin ? 'Управление заказами' : 'Мои заказы'}
                </h1>

                <div className={styles.content}>
                    {loading ? (
                        <div className={styles.statusMsg}>Загрузка данных...</div>
                    ) : error ? (
                        <div className={styles.errorMsg}>{error}</div>
                    ) : orders.length > 0 ? (
                        <div className={styles.ordersList}>
                            {orders.map((order) => (
                                <OrderList
                                    key={order.id}
                                    id={order.id}
                                    data={order.createdAt}
                                    status={order.status}
                                    list={order.items}
                                    onOrderCancelled={refresh}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.empty}>
                            <p>Заказов пока нет</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}