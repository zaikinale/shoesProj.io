// pages/Categories.jsx
import { useEffect, useState } from 'react';
import {
    getCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategory,
    addGoodToCategory,
    removeGoodFromCategory,
    getGoodsByCategory
} from '../api/categories.js';
import { getGoods } from '../api/goods.js';
import { useStore } from '../store/useUserContext';

export default function Categories() {
    const { user } = useStore();
    const [categories, setCategories] = useState([]);
    const [goods, setGoods] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryGoods, setCategoryGoods] = useState([]);
    const [form, setForm] = useState({ 
        name: '', 
        description: '',
        goodIds: [] // ← добавляем массив выбранных товаров
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [view, setView] = useState('list'); // 'list' | 'form' | 'edit' | 'goods'

    const isAdmin = user?.roleID === 3;

    useEffect(() => {
        loadCategories();
        loadGoods();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            loadCategoryGoods(selectedCategory.id);
        }
    }, [selectedCategory]);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadGoods = async () => {
        try {
            const data = await getGoods();
            setGoods(data);
        } catch (err) {
            console.error('Failed to load goods:', err);
        }
    };

    const loadCategoryGoods = async (categoryId) => {
        try {
            const data = await getGoodsByCategory(categoryId);
            setCategoryGoods(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    try {
        setLoading(true);
        let category;
        
        if (view === 'edit' && selectedCategory) {
            // === Редактирование ===
            await updateCategory(selectedCategory.id, { 
                description: form.description 
            });
            category = selectedCategory;
            
            // Синхронизация товаров
            const currentGoodIds = categoryGoods.map(g => g.id);
            const newGoodIds = form.goodIds.map(id => parseInt(id));
            
            // Добавляем новые
            for (const goodId of newGoodIds) {
                if (!currentGoodIds.includes(goodId)) {
                    await addGoodToCategory(category.id, goodId);
                }
            }
            // Удаляем лишние
            for (const goodId of currentGoodIds) {
                if (!newGoodIds.includes(goodId)) {
                    await removeGoodFromCategory(category.id, goodId);
                }
            }
        } else {
            // === Создание новой ===
            // ⚠️ Отправляем ТОЛЬКО name и description
            category = await addCategory({ 
                name: form.name, 
                description: form.description 
            });
            
            // Затем добавляем товары отдельными запросами
            for (const goodId of form.goodIds) {
                await addGoodToCategory(category.id, parseInt(goodId));
            }
        }
        
        // Сброс формы
        setForm({ name: '', description: '', goodIds: [] });
        setView('list');
        setSelectedCategory(null);
        await loadCategories();
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};

    const handleDelete = async (id) => {
        if (!window.confirm('Удалить категорию?')) return;
        try {
            await deleteCategory(id);
            await loadCategories();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddGood = async (goodId) => {
        if (!selectedCategory) return;
        try {
            await addGoodToCategory(selectedCategory.id, goodId);
            await loadCategoryGoods(selectedCategory.id);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRemoveGood = async (goodId) => {
        if (!selectedCategory) return;
        try {
            await removeGoodFromCategory(selectedCategory.id, goodId);
            await loadCategoryGoods(selectedCategory.id);
        } catch (err) {
            setError(err.message);
        }
    };

    const openEdit = async (category) => {
        setSelectedCategory(category);
        setForm({ 
            name: category.name, 
            description: category.description || '',
            goodIds: [] // при редактировании загрузим товары отдельно
        });
        setView('edit');
        
        // Загружаем текущие товары категории
        try {
            const currentGoods = await getGoodsByCategory(category.id);
            setForm(f => ({
                ...f,
                goodIds: currentGoods.map(g => String(g.id))
            }));
        } catch (err) {
            console.error('Failed to load category goods:', err);
        }
    };

    const toggleGoodSelection = (goodId) => {
        setForm(f => ({
            ...f,
            goodIds: f.goodIds.includes(goodId)
                ? f.goodIds.filter(id => id !== goodId)
                : [...f.goodIds, goodId]
        }));
    };

    if (!isAdmin) {
        return <div className="categories__access-denied">Доступ только для администраторов</div>;
    }

    return (
        <div className="categories">
            <header className="categories__header">
                <h1 className="categories__title">Категории</h1>
                {view === 'list' && (
                    <button className="categories__btn" onClick={() => setView('form')}>
                        + Новая категория
                    </button>
                )}
                {view !== 'list' && (
                    <button className="categories__btn" onClick={() => {
                        setView('list');
                        setSelectedCategory(null);
                        setForm({ name: '', description: '', goodIds: [] });
                    }}>
                        ← Назад
                    </button>
                )}
            </header>

            {error && <div className="categories__error">{error}</div>}
            {loading && <div className="categories__loading">Загрузка...</div>}

            {/* Список категорий */}
            {view === 'list' && (
                <ul className="categories__list">
                    {categories.map(cat => (
                        <li key={cat.id} className="categories__item">
                            <div className="categories__item-info">
                                <strong>{cat.name}</strong>
                                {cat.description && <p>{cat.description}</p>}
                                <small>Товаров: {cat._count?.goods || 0}</small>
                            </div>
                            <div className="categories__item-actions">
                                <button className="categories__link" onClick={() => {
                                    setSelectedCategory(cat);
                                    setView('goods');
                                }}>
                                    Товары
                                </button>
                                <button className="categories__link" onClick={() => openEdit(cat)}>
                                    Редактировать
                                </button>
                                <button className="categories__link categories__link--danger" onClick={() => handleDelete(cat.id)}>
                                    Удалить
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Форма создания/редактирования */}
            {(view === 'form' || view === 'edit') && (
                <form className="categories__form" onSubmit={handleSubmit}>
                    <label className="categories__label">
                        Название *
                        <input
                            className="categories__input"
                            type="text"
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            disabled={view === 'edit'}
                            required
                        />
                    </label>
                    
                    <label className="categories__label">
                        Описание (материалы, гарантия и т.д.)
                        <textarea
                            className="categories__input"
                            value={form.description}
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            rows="4"
                        />
                    </label>

                    {/* Выбор товаров */}
                    <div className="categories__goods-select">
                        <label className="categories__label">
                            Товары в категории
                            <div className="categories__goods-checkboxes">
                                {goods.length === 0 ? (
                                    <p className="categories__no-goods">Нет доступных товаров</p>
                                ) : (
                                    goods.map(good => (
                                        <label key={good.id} className="categories__checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={form.goodIds.includes(String(good.id))}
                                                onChange={() => toggleGoodSelection(String(good.id))}
                                                className="categories__checkbox"
                                            />
                                            <span className="categories__checkbox-text">
                                                {good.title} — {good.price} ₽
                                            </span>
                                        </label>
                                    ))
                                )}
                            </div>
                        </label>
                        {form.goodIds.length > 0 && (
                            <small className="categories__hint">
                                Выбрано товаров: {form.goodIds.length}
                            </small>
                        )}
                    </div>

                    <button className="categories__btn categories__btn--primary" type="submit" disabled={loading}>
                        {loading ? 'Сохранение...' : 'Сохранить'}
                    </button>
                </form>
            )}

            {/* Управление товарами в категории */}
            {view === 'goods' && selectedCategory && (
                <div className="categories__goods-manager">
                    <h2>Товары в «{selectedCategory.name}»</h2>

                    <section className="categories__goods-section">
                        <h3>Добавить товар</h3>
                        <ul className="categories__goods-list">
                            {goods
                                .filter(g => !categoryGoods.some(cg => cg.id === g.id))
                                .map(good => (
                                    <li key={good.id} className="categories__goods-item">
                                        <span>{good.title} — {good.price} ₽</span>
                                        <button
                                            className="categories__link"
                                            onClick={() => handleAddGood(good.id)}
                                        >
                                            + Добавить
                                        </button>
                                    </li>
                                ))}
                            {goods.filter(g => !categoryGoods.some(cg => cg.id === g.id)).length === 0 && (
                                <li className="categories__goods-empty">Все товары добавлены</li>
                            )}
                        </ul>
                    </section>

                    <section className="categories__goods-section">
                        <h3>Уже в категории</h3>
                        {categoryGoods.length === 0 ? (
                            <p>Нет товаров</p>
                        ) : (
                            <ul className="categories__goods-list">
                                {categoryGoods.map(good => (
                                    <li key={good.id} className="categories__goods-item">
                                        <span>{good.title} — {good.price} ₽</span>
                                        <button
                                            className="categories__link categories__link--danger"
                                            onClick={() => handleRemoveGood(good.id)}
                                        >
                                            − Убрать
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>
            )}
        </div>
    );
}