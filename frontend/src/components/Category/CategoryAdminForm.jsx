import { useState, useEffect } from 'react';
import styles from '../../pages/Categories/Categories.module.css';

const CategoryAdminForm = ({ initialData, allGoods, onSubmit, loading }) => {
    const [form, setForm] = useState({ name: '', description: '', goodIds: [] });

    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name || '',
                description: initialData.description || '',
                goodIds: initialData.goods?.map(g => String(g.id)) || []
            });
        }
    }, [initialData]);

    const toggleGood = (id) => {
        setForm(prev => ({
            ...prev,
            goodIds: prev.goodIds.includes(String(id))
                ? prev.goodIds.filter(i => i !== String(id))
                : [...prev.goodIds, String(id)]
        }));
    };

    return (
        <form className={styles.formCard} onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
            <div className={styles.formGroup}>
                <label>Название категории</label>
                <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    disabled={!!initialData}
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label>Описание</label>
                <textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows="4"
                />
            </div>
            <div className={styles.goodsSelector}>
                <label>Товары в категории ({form.goodIds.length})</label>
                <div className={styles.goodsScroll}>
                    {allGoods.map(good => (
                        <label key={good.id} className={styles.checkItem}>
                            <input
                                type="checkbox"
                                checked={form.goodIds.includes(String(good.id))}
                                onChange={() => toggleGood(good.id)}
                            />
                            <div className={styles.checkText}>
                                <span>{good.title}</span>
                                <span className={styles.checkPrice}>{good.price.toLocaleString()} ₽</span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>
            <button className={styles.btnSave} type="submit" disabled={loading}>
                {loading ? 'Сохранение...' : initialData ? 'Сохранить изменения' : 'Создать категорию'}
            </button>
        </form>
    );
};

export default CategoryAdminForm;