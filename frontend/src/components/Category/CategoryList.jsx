import styles from '../../pages/Categories/Categories.module.css';

const CategoryList = ({ items, isAdmin, isManager, onCategoryClick, onEdit, onDelete }) => (
    <div className={styles.categoriesGrid}>
        {items.map(cat => (
            <div key={cat.id} className={styles.catCard} onClick={() => onCategoryClick(cat.id)}>
                <div className={styles.catContent}>
                    <h3>{cat.name}</h3>
                    <p>{cat.description}</p>
                    <span className={styles.count}>{cat._count?.goods || 0} товаров</span>
                </div>
                {(isAdmin || isManager) && (
                    <div className={styles.adminActions} onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => onEdit(cat)}>Править</button>
                        {isAdmin && <button onClick={() => onDelete(cat.id)} className={styles.btnDel}>Удалить</button>}
                    </div>
                )}
            </div>
        ))}
    </div>
);

export default CategoryList;