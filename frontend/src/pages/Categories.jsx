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
import NavigateTo from '../utils/navBtn.jsx';
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
        goodIds: [] 
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [view, setView] = useState('list');

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
            await updateCategory(selectedCategory.id, { 
                description: form.description 
            });
            category = selectedCategory;
            
            const currentGoodIds = categoryGoods.map(g => g.id);
            const newGoodIds = form.goodIds.map(id => parseInt(id));
            
            for (const goodId of newGoodIds) {
                if (!currentGoodIds.includes(goodId)) {
                    await addGoodToCategory(category.id, goodId);
                }
            }
            for (const goodId of currentGoodIds) {
                if (!newGoodIds.includes(goodId)) {
                    await removeGoodFromCategory(category.id, goodId);
                }
            }
        } else {
            category = await addCategory({ 
                name: form.name, 
                description: form.description 
            });
            
            for (const goodId of form.goodIds) {
                await addGoodToCategory(category.id, parseInt(goodId));
            }
        }
        
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
            goodIds: []
        });
        setView('edit');
        
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
            <header className="head">
                <NavigateTo path="categories"/>
                {/* <h1 className="">Категории</h1> */}
                <div className="controls">
                    <NavigateTo path="store"/>
                    <NavigateTo path="basket"/>
                    <NavigateTo path="orders"/>
                    <NavigateTo path="profile"/>
                    {view === 'list' && (
                        <button className="categories__btn" onClick={() => setView('form')}>
                            + new
                        </button>
                    )}
                    {view !== 'list' && (
                        <button className="categories__btn" onClick={() => {
                            setView('list');
                            setSelectedCategory(null);
                            setForm({ name: '', description: '', goodIds: [] });
                        }}>
                            ← back
                        </button>
                    )}
                </div>
            </header>

            {error && <div className="categories__error">{error}</div>}

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

            {(view === 'form' || view === 'edit') && (
                <form className="form" onSubmit={handleSubmit}>
                    <label className="categories__label">
                        name
                        <input
                            className=""
                            type="text"
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            disabled={view === 'edit'}
                            required
                        />
                    </label>
                    
                    <label className="categories__label">
                        description
                        <textarea
                            className=""
                            value={form.description}
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            rows="4"
                        />
                    </label>

                    <div className="select_good_section">
                        <label className="categories__label">
                            Goods in category
                            <div className="goods_container">
                                {goods.length === 0 ? (
                                    <p className="categories__no-goods">Don`t have goods</p>
                                ) : (
                                    goods.map(good => (
                                        <label key={good.id} className="good_block">
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