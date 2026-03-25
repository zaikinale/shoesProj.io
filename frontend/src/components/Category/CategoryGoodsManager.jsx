import styles from '../../pages/Categories/Categories.module.css';

const CategoryGoodsManager = ({ category, categoryGoods, allGoods, onAdd, onRemove }) => {
    const availableGoods = allGoods.filter(
        g => !categoryGoods.some(cg => cg.id === g.id)
    );

    return (
        <div className={styles.managerLayout}>
            <div className={styles.managerSection}>
                <h3 className={styles.sectionTitle}>В категории ({categoryGoods.length})</h3>
                <div className={styles.managerList}>
                    {categoryGoods.map(good => (
                        <div key={good.id} className={styles.managerItem}>
                            <div className={styles.itemInfo}>
                                <span className={styles.itemName}>{good.title}</span>
                                <span className={styles.itemPrice}>{good.price.toLocaleString()} ₽</span>
                            </div>
                            <button 
                                className={styles.btnRemoveMini} 
                                onClick={() => onRemove(good.id)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.managerSection}>
                <h3 className={styles.sectionTitle}>Доступные товары</h3>
                <div className={styles.managerList}>
                    {availableGoods.map(good => (
                        <div key={good.id} className={styles.managerItem}>
                            <div className={styles.itemInfo}>
                                <span className={styles.itemName}>{good.title}</span>
                                <span className={styles.itemPrice}>{good.price.toLocaleString()} ₽</span>
                            </div>
                            <button 
                                className={styles.btnAddMini} 
                                onClick={() => onAdd(good.id)}
                            >
                                +
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryGoodsManager;