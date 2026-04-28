import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useUserContext.jsx';
import { useStoreData } from '../../hooks/useStoreData.js';
import { useGoodsFilters } from '../../hooks/useGoodsFilters.js';
import Card from "../../components/Card/Card.jsx";
import styles from './Store.module.css';

import SearchIcon from '../../assets/search.svg';
import Logotype from '../../assets/logo.svg';

export default function Store() {
    const navigate = useNavigate();

    const userRole = useStore((state) => state.user?.roleID);
    const isInitialized = useStore((state) => state.isInitialized);
    
    const { goods, categories, isLoading, refresh } = useStoreData(isInitialized, userRole);
    const { 
        searchQuery, setSearchQuery, 
        sortOrder, setSortOrder, 
        filteredAndSortedGoods 
    } = useGoodsFilters(goods);

    const hasToken = !!localStorage.getItem('token');

    if (isInitialized && !userRole && hasToken) return <div className={styles.loader}>Синхронизация...</div>;
    
    if (!isInitialized || (isLoading && goods.length === 0)) {
        return <div className={styles.loader}>Loading...</div>;
    }

    const getCardType = () => {
        if (userRole === 3) return 'admin';
        if (userRole === 2) return 'manager';
        if (userRole === 1) return 'user';
        return 'guest';
    };

    return (
        <main className={styles.store}>
            <header className={styles.store__header}>
                <div className={styles.store__topBar}>
                    <img src={Logotype} alt="Logo" className={styles.store__logo} />
                    
                    <div className={styles.store__searchWrapper}>
                        <img src={SearchIcon} alt="" />
                        <input 
                            type="text" 
                            placeholder="Поиск товаров..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.store__searchInput}
                        />
                    </div>

                    <nav className={styles.store__nav}>
                        {/* АДМИН */}
                        {userRole === 3 && (
                            <>
                                <button onClick={() => navigate('/admin/products/add')} className={styles.store__btnPlus}>+ Товар</button>
                                <button onClick={() => navigate('/staff')}>Сотрудники</button>
                                <button onClick={() => navigate('/categories')}>Категории</button>
                                <button onClick={() => navigate('/orders')}>Заказы</button>
                                <button onClick={() => navigate('/help')}>Поддержка</button>
                                <button onClick={() => navigate('/profile')}>Профиль</button>
                            </>
                        )}

                        {/* МЕНЕДЖЕР */}
                        {userRole === 2 && (
                            <>
                                <button onClick={() => navigate('/categories')}>Категории</button>
                                <button onClick={() => navigate('/orders')}>Заказы</button>
                                <button onClick={() => navigate('/help')}>Поддержка</button>
                                <button onClick={() => navigate('/profile')}>Профиль</button>
                            </>
                        )}

                        {/* ЮЗЕР / ГОСТЬ */}
                        {userRole ? (
                            <>
                                {userRole === 1 && <button onClick={() => navigate('/basket')}>Корзина</button>}
                                <button onClick={() => navigate('/orders')}>Заказы</button>
                                <button onClick={() => navigate('/help')}>Поддержка</button>
                                <button onClick={() => navigate('/profile')}>Профиль</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => navigate('/login')}>Войти</button>
                                <button onClick={() => navigate('/register')}>Регистрация</button>
                            </>
                        )}
                    </nav>
                </div>

                <div className={styles.store__subHeader}>
                    <div className={styles.store__categories}>
                        {categories.map(cat => (
                            <button key={cat.id} onClick={() => navigate(`/categories/${cat.id}`)} className={styles.store__categoryChip}>
                                {cat.name}
                            </button>
                        ))}
                    </div>
                    {
                        userRole === 3 && (
                            <div className={styles.store__filters}>
                                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                                    <option value="original">По умолчанию</option>
                                    <option value="alphabet">По алфавиту</option>
                                </select>
                            </div>
                        )
                    }
                    
                </div>
            </header>

            <section className={styles.store__content}>
                <div className={styles.store__grid}>
                    {filteredAndSortedGoods.map(item => (
                        <Card 
                            key={item.id} 
                            {...item} 
                            type={getCardType()} 
                            refreshGoods={refresh} 
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}