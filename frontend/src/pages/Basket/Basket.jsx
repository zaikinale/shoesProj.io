import { useNavigate } from 'react-router-dom';
import { useBasket } from '../../hooks/useBasket.js';
import BasketCard from '../../components/BasketCard/BasketCard.jsx';
import NavigateTo from '../../utils/navBtn.jsx';
import styles from './Basket.module.css';

export default function Basket() {
    const navigate = useNavigate();
    const { items, totals, isLoading, clear, checkout, refresh } = useBasket();

    const handleCheckout = async () => {
        const success = await checkout();
        if (success) navigate('/orders');
    };

    if (isLoading && items.length === 0) {
        return <div className={styles.loader}>Загрузка корзины...</div>;
    }

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <div className={styles.headerTitle}>Корзина</div>
                    <nav className={styles.nav}>
                        <NavigateTo path="store" />
                        <NavigateTo path="orders" />
                        <NavigateTo path="profile" />
                    </nav>
                </div>
            </header>

            <main className={styles.container}>
                {items.length > 0 ? (
                    <div className={styles.content}>
                        <section className={styles.list}>
                            {items.map((item) => (
                                <BasketCard
                                    key={item.id}
                                    {...item.good}
                                    id={item.id}
                                    quantity={item.quantity}
                                    refreshGoods={refresh}
                                />
                            ))}
                        </section>

                        <aside className={styles.sidebar}>
                            <div className={styles.summary}>
                                <h3 className={styles.summaryTitle}>Ваш заказ</h3>
                                
                                <div className={styles.summaryRow}>
                                    <span className={styles.label}>Товары: </span>
                                    <span className={styles.value}>{totals.count} шт.</span>
                                </div>

                                <div className={styles.totalRow}>
                                    <span className={styles.totalLabel}>Итого: </span>
                                    <span className={styles.totalValue}>{totals.price.toLocaleString()} ₽</span>
                                </div>

                                <button 
                                    className={styles.btnOrder} 
                                    onClick={handleCheckout}
                                >
                                    Оформить заказ
                                </button>
                                <button 
                                    className={styles.btnClear} 
                                    onClick={clear}
                                >
                                    Очистить всё
                                </button>
                            </div>
                        </aside>
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <h2>В корзине пока пусто</h2>
                        <button onClick={() => navigate('/store')}>Перейти к покупкам</button>
                    </div>
                )}
            </main>
        </div>
    );
}