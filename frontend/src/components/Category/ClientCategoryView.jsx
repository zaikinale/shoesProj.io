import Card from '../Card/Card.jsx';
import SearchIcon from '../../assets/search.svg';
import styles from '../../pages/Categories/Categories.module.css';
import { useState } from 'react';

const ClientCategoryView = ({ category, goods, user }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredGoods = goods.filter(good => {
        if (!searchQuery.trim()) return true;
        const lowerQuery = searchQuery.toLowerCase();
        return (
            (good.title || '').toLowerCase().includes(lowerQuery) ||
            (good.description || '').toLowerCase().includes(lowerQuery)
        );
    });

    return (
        <div className={styles.clientView}>
            <div className={styles.categoryHero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.pageTitle}>{category.name}</h1>
                    <p className={styles.categoryDesc}>{category.description}</p>
                </div>
                
                <div className={styles.searchWrapper}>
                    <img src={SearchIcon} alt="search" className={styles.searchIcon} />
                    <input 
                        type="text" 
                        placeholder="Поиск товаров в этой категории..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            <div className={styles.goodsGrid}>
                {filteredGoods.length > 0 ? (
                    filteredGoods.map((good) => (
                        <Card key={good.id} {...good} type={user ? 'user' : 'login'} />
                    ))
                ) : (
                    <div className={styles.empty}>
                        <h3>Ничего не найдено</h3>
                        <p>Попробуйте изменить запрос или загляните позже</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientCategoryView;