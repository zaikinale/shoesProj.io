// import { useEffect, useState } from 'react';
// import {
//     getCategories,
//     getCategoryById,
//     addCategory,
//     updateCategory,
//     deleteCategory,
//     addGoodToCategory,
//     removeGoodFromCategory,
//     getGoodsByCategory
// } from '../api/categories.js';
// import { getGoods } from '../api/goods.js';
// import NavigateTo from '../utils/navBtn.jsx';
// import { useStore } from '../store/useUserContext';

// export default function Categories() {
//     const { user } = useStore();
//     const [categories, setCategories] = useState([]);
//     const [goods, setGoods] = useState([]);
//     const [selectedCategory, setSelectedCategory] = useState(null);
//     const [categoryGoods, setCategoryGoods] = useState([]);
//     const [form, setForm] = useState({ 
//         name: '', 
//         description: '',
//         goodIds: [] 
//     });
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [view, setView] = useState('list');

//     const isAdmin = user?.roleID === 3;

//     useEffect(() => {
//         loadCategories();
//         loadGoods();
//     }, []);

//     useEffect(() => {
//         if (selectedCategory) {
//             loadCategoryGoods(selectedCategory.id);
//         }
//     }, [selectedCategory]);

//     const loadCategories = async () => {
//         try {
//             setLoading(true);
//             const data = await getCategories();
//             setCategories(data);
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const loadGoods = async () => {
//         try {
//             const data = await getGoods();
//             setGoods(data);
//         } catch (err) {
//             console.error('Failed to load goods:', err);
//         }
//     };

//     const loadCategoryGoods = async (categoryId) => {
//         try {
//             const data = await getGoodsByCategory(categoryId);
//             setCategoryGoods(data);
//         } catch (err) {
//             setError(err.message);
//         }
//     };

//     const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.name.trim()) return;

//     try {
//         setLoading(true);
//         let category;
        
//         if (view === 'edit' && selectedCategory) {
//             await updateCategory(selectedCategory.id, { 
//                 description: form.description 
//             });
//             category = selectedCategory;
            
//             const currentGoodIds = categoryGoods.map(g => g.id);
//             const newGoodIds = form.goodIds.map(id => parseInt(id));
            
//             for (const goodId of newGoodIds) {
//                 if (!currentGoodIds.includes(goodId)) {
//                     await addGoodToCategory(category.id, goodId);
//                 }
//             }
//             for (const goodId of currentGoodIds) {
//                 if (!newGoodIds.includes(goodId)) {
//                     await removeGoodFromCategory(category.id, goodId);
//                 }
//             }
//         } else {
//             category = await addCategory({ 
//                 name: form.name, 
//                 description: form.description 
//             });
            
//             for (const goodId of form.goodIds) {
//                 await addGoodToCategory(category.id, parseInt(goodId));
//             }
//         }
        
//         setForm({ name: '', description: '', goodIds: [] });
//         setView('list');
//         setSelectedCategory(null);
//         await loadCategories();
//     } catch (err) {
//         setError(err.message);
//     } finally {
//         setLoading(false);
//     }
// };

//     const handleDelete = async (id) => {
//         if (!window.confirm('Удалить категорию?')) return;
//         try {
//             await deleteCategory(id);
//             await loadCategories();
//         } catch (err) {
//             setError(err.message);
//         }
//     };

//     const handleAddGood = async (goodId) => {
//         if (!selectedCategory) return;
//         try {
//             await addGoodToCategory(selectedCategory.id, goodId);
//             await loadCategoryGoods(selectedCategory.id);
//         } catch (err) {
//             setError(err.message);
//         }
//     };

//     const handleRemoveGood = async (goodId) => {
//         if (!selectedCategory) return;
//         try {
//             await removeGoodFromCategory(selectedCategory.id, goodId);
//             await loadCategoryGoods(selectedCategory.id);
//         } catch (err) {
//             setError(err.message);
//         }
//     };

//     const openEdit = async (category) => {
//         setSelectedCategory(category);
//         setForm({ 
//             name: category.name, 
//             description: category.description || '',
//             goodIds: []
//         });
//         setView('edit');
        
//         try {
//             const currentGoods = await getGoodsByCategory(category.id);
//             setForm(f => ({
//                 ...f,
//                 goodIds: currentGoods.map(g => String(g.id))
//             }));
//         } catch (err) {
//             console.error('Failed to load category goods:', err);
//         }
//     };

//     const toggleGoodSelection = (goodId) => {
//         setForm(f => ({
//             ...f,
//             goodIds: f.goodIds.includes(goodId)
//                 ? f.goodIds.filter(id => id !== goodId)
//                 : [...f.goodIds, goodId]
//         }));
//     };

//     if (!isAdmin) {
//         return <div className="categories__access-denied">Access for administrators only</div>;
//     }

//     return (
//         <div className="categories">
//             <header className="head">
//                 <NavigateTo path="store"/>
//                 <div className="controls">
//                     <NavigateTo path="store"/>
//                     <NavigateTo path="basket"/>
//                     <NavigateTo path="orders"/>
//                     <NavigateTo path="profile"/>
//                     {view === 'list' && (
//                         <button className="categories__btn" onClick={() => setView('form')}>
//                             + new
//                         </button>
//                     )}
//                     {view !== 'list' && (
//                         <button className="categories__btn" onClick={() => {
//                             setView('list');
//                             setSelectedCategory(null);
//                             setForm({ name: '', description: '', goodIds: [] });
//                         }}>
//                             ← back
//                         </button>
//                     )}
//                 </div>
//             </header>

//             {error && <div className="categories__error">{error}</div>}

//             {view === 'list' && (
//                 <ul className="categories__list">
//                     {categories.map(cat => (
//                         <li key={cat.id} className="block card">
//                             <div className="categories__item-info">
//                                 <h3>{cat.name}</h3>
//                                 {cat.description && <p>{cat.description}</p>}
//                                 <small>Products in category: {cat._count?.goods || 0}</small>
//                             </div>
//                             <div className="controls">
//                                 <button className="btn" onClick={() => {
//                                     setSelectedCategory(cat);
//                                     setView('goods');
//                                 }}>
//                                     goods
//                                 </button>
//                                 <button className="btn" onClick={() => openEdit(cat)}>
//                                     edit
//                                 </button>
//                                 <button className="btn" onClick={() => handleDelete(cat.id)}>
//                                     delete
//                                 </button>
//                             </div>
//                         </li>
//                     ))}
//                 </ul>
//             )}

//             {(view === 'form' || view === 'edit') && (
//                 <form className="form card" onSubmit={handleSubmit}>
//                     <label className="categories__label">
//                         Name
//                         <input
//                             className=""
//                             type="text"
//                             value={form.name}
//                             onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
//                             disabled={view === 'edit'}
//                             required
//                         />
//                     </label>
                    
//                     <label className="categories__label">
//                         Description
//                         <textarea
//                             className=""
//                             value={form.description}
//                             onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
//                             rows="4"
//                         />
//                     </label>

//                         {form.goodIds.length > 0 && (
//                             <small className="categories__hint">
//                                 Products in category: {form.goodIds.length}
//                             </small>
//                         )}

//                     <button className="categories__btn categories__btn--primary" type="submit" disabled={loading}>
//                         {loading ? 'Saving...' : 'Save'}
//                     </button>

//                     {/* <div className="select_good_section">
//                         <label className="categories__label">
//                             Goods for category
//                             <div className="goods_container">
//                                 {goods.length === 0 ? (
//                                     <p className="categories__no-goods">Don`t have goods</p>
//                                 ) : (
//                                     goods.map(good => (
//                                         <label key={good.id} className="good_block">
//                                             <input
//                                                 type="checkbox"
//                                                 checked={form.goodIds.includes(String(good.id))}
//                                                 onChange={() => toggleGoodSelection(String(good.id))}
//                                                 className="categories__checkbox"
//                                             />
//                                             <span className="categories__checkbox-text">
//                                                 {good.title} — {good.price} ₽
//                                             </span>
//                                         </label>
//                                     ))
//                                 )}
//                             </div>
//                         </label>
//                     </div> */}
//                 </form>
//             )}

//             {view === 'goods' && selectedCategory && (
//                 <div className="categories__goods-manager">
//                     <h2>Goods in «{selectedCategory.name}»</h2>

//                     <section className="categories__goods-section">
//                         <h3>Add good</h3>
//                         <ul className="categories__goods-list">
//                             {goods
//                                 .filter(g => !categoryGoods.some(cg => cg.id === g.id))
//                                 .map(good => (
//                                     <li key={good.id} className="categories__goods-item">
//                                         <span>{good.title} — {good.price} ₽</span>
//                                         <button
//                                             className="categories__link"
//                                             onClick={() => handleAddGood(good.id)}
//                                         >
//                                             + add
//                                         </button>
//                                     </li>
//                                 ))}
//                             {goods.filter(g => !categoryGoods.some(cg => cg.id === g.id)).length === 0 && (
//                                 <li className="categories__goods-empty">All products added</li>
//                             )}
//                         </ul>
//                     </section>

//                     <section className="categories__goods-section">
//                         <h3>Already in category</h3>
//                         {categoryGoods.length === 0 ? (
//                             <p>No products</p>
//                         ) : (
//                             <ul className="categories__goods-list">
//                                 {categoryGoods.map(good => (
//                                     <li key={good.id} className="categories__goods-item">
//                                         <span>{good.title} — {good.price} ₽</span>
//                                         <button
//                                             className="categories__link categories__link--danger"
//                                             onClick={() => handleRemoveGood(good.id)}
//                                         >
//                                             − Close
//                                         </button>
//                                     </li>
//                                 ))}
//                             </ul>
//                         )}
//                     </section>
//                 </div>
//             )}
//         </div>
//     );
// }

// pages/Categories.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import Card from '../components/Card.jsx'; // ← Используем твой компонент
import NavigateTo from '../utils/navBtn.jsx';
import { useStore } from '../store/useUserContext';
import SearchIcon from '../assets/search.svg';

export default function Categories() {
    const { user } = useStore();
    const navigate = useNavigate();
    const { id } = useParams(); // Для просмотра конкретной категории

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
    const [view, setView] = useState('list'); // list, form, edit, goods, client-view
    const [searchQuery, setSearchQuery] = useState('');

    const isAdmin = user?.roleID === 3;
    const isManager = user?.roleID === 2;

    useEffect(() => {
        // Если есть ID в URL — это клиентский просмотр категории
        if (id) {
            setView('client-view');
            loadCategoryDetails(Number(id));
        } else {
            loadCategories();
            if (isAdmin || isManager) {
                loadGoods();
            }
        }
    }, [id]);

    useEffect(() => {
        if (selectedCategory && (isAdmin || isManager)) {
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

    const loadCategoryDetails = async (categoryId) => {
        try {
            setLoading(true);
            const data = await getCategoryById(categoryId);
            setSelectedCategory(data);
            setCategoryGoods(data.goods || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
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
            navigate('/categories'); // Сброс URL
            await loadCategories();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (catId) => {
        if (!window.confirm('Delete category?')) return;
        try {
            await deleteCategory(catId);
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

    const handleCategoryClick = (categoryId) => {
        // Для клиентов — переход на страницу категории
        // Для админов — открытие управления
        if (isAdmin || isManager) {
            const cat = categories.find(c => c.id === categoryId);
            setSelectedCategory(cat);
            setView('goods');
        } else {
            navigate(`/categories/${categoryId}`);
        }
    };

    const handleBack = () => {
        if (id) {
            navigate('/categories');
        } else {
            setView('list');
            setSelectedCategory(null);
            setForm({ name: '', description: '', goodIds: [] });
        }
    };

    const filteredGoods = categoryGoods.filter(good => {
        if (!searchQuery.trim()) return true;
        const lowerQuery = searchQuery.toLowerCase();
        const title = (good.title || '').toLowerCase();
        const description = (good.description || '').toLowerCase();
        return title.includes(lowerQuery) || description.includes(lowerQuery);
    });

    const refreshGoods = () => {
        if (selectedCategory) {
            loadCategoryGoods(selectedCategory.id);
        }
    };

    // ==================== КЛИЕНТСКИЙ ПРОСМОТР КОНКРЕТНОЙ КАТЕГОРИИ ====================
    if (view === 'client-view' && selectedCategory) {
        return (
            <section className="category-page">
                <div className="container">
                    <div className="head">
                        <div className="controls">
                            <NavigateTo path="store" />
                            {/* <button className="btn-back" onClick={handleBack}>
                                ← Categories
                            </button> */}
                            <div className="controlsInput">
                                <img src={SearchIcon} alt="search"/>
                                <input
                                    type="search"
                                    className='search'
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search in category"
                                />
                            </div>
                        </div>
                        <div className="controllers">
                            {user && (
                                <>
                                    <NavigateTo path="basket" />
                                    <NavigateTo path="orders" />
                                    <NavigateTo path="profile" />
                                </>
                            )}
                            {!user && (
                                <>
                                    <NavigateTo path="login" />
                                    <NavigateTo path="register" />
                                </>
                            )}
                        </div>
                    </div>

                    <div className="category-header">
                        <h3 className="category-title">{selectedCategory.name}</h3>
                        {selectedCategory.description && (
                            <p className="category-description">{selectedCategory.description}</p>
                        )}
                        {/* <p className="category-stats">
                            {filteredGoods.length} {filteredGoods.length === 1 ? 'product' : 'products'}
                        </p> */}
                    </div>

                    <div className="container">
                        {filteredGoods.length > 0 ? (
                            filteredGoods.map((good) => (
                                <Card
                                    key={good.id}
                                    id={good.id}
                                    title={good.title}
                                    desc={good.description}
                                    price={good.price}
                                    image={good.image}
                                    type={user ? 'user' : 'login'}
                                    isActive={good.isActive}
                                    isInBasket={good.isInBasket}
                                    refreshGoods={refreshGoods}
                                    basketItemId={good.basketItemId}
                                />
                            ))
                        ) : (
                            <p className="no-products">
                                {searchQuery ? 'No products found' : 'No products in this category yet'}
                            </p>
                        )}
                    </div>
                </div>
            </section>
        );
    }

    // ==================== АДМИН ПАНЕЛЬ ====================
    if (!isAdmin && !isManager) {
        // Если не админ и не менеджер — показываем просто список категорий для просмотра
        return (
            <section className="categories">
                <div className="container">
                    <div className="head">
                        <NavigateTo path="store" />
                        <div className="controllers">
                            {user && (
                                <>
                                    <NavigateTo path="basket" />
                                    <NavigateTo path="orders" />
                                    <NavigateTo path="profile" />
                                </>
                            )}
                            {!user && (
                                <>
                                    <NavigateTo path="login" />
                                    <NavigateTo path="register" />
                                </>
                            )}
                        </div>
                    </div>

                    <h2 className="categories-title">Categories</h2>

                    <div className="categories-grid">
                        {categories.length > 0 ? (
                            categories.map(cat => (
                                <div 
                                    key={cat.id} 
                                    className="category-card"
                                    onClick={() => handleCategoryClick(cat.id)}
                                >
                                    <h3 className="category-name">{cat.name}</h3>
                                    {cat.description && (
                                        <p className="category-description">
                                            {cat.description.length > 100 
                                                ? cat.description.substring(0, 100) + '...' 
                                                : cat.description}
                                        </p>
                                    )}
                                    <div className="category-stats">
                                        <span className="goods-count">
                                            {cat._count?.goods || 0} {cat._count?.goods === 1 ? 'product' : 'products'}
                                        </span>
                                        <span className="category-arrow">→</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-categories">No categories found</p>
                        )}
                    </div>
                </div>
            </section>
        );
    }

    // ==================== АДМИН / МЕНЕДЖЕР ИНТЕРФЕЙС ====================
    return (
        <section className="categories">
            <div className="container">
                <header className="head">
                    <NavigateTo path="store"/>
                    <div className="controls">
                        <NavigateTo path="basket"/>
                        <NavigateTo path="orders"/>
                        <NavigateTo path="profile"/>
                        {view === 'list' && isAdmin && (
                            <button className="categories__btn" onClick={() => setView('form')}>
                                + new
                            </button>
                        )}
                        {view !== 'list' && (
                            <button className="categories__btn" onClick={handleBack}>
                                ← back
                            </button>
                        )}
                    </div>
                </header>

                {error && <div className="categories__error">{error}</div>}

                {view === 'list' && (
                    <div className="categories-grid">
                        {categories.map(cat => (
                            <div key={cat.id} className="category-card admin-card">
                                <div className="categories__item-info">
                                    <h3 className="category-name">{cat.name}</h3>
                                    {cat.description && <p className="category-description">{cat.description}</p>}
                                    <small className="category-stats">
                                        Products: {cat._count?.goods || 0}
                                    </small>
                                </div>
                                <div className="controls">
                                    <button className="btn" onClick={() => {
                                        setSelectedCategory(cat);
                                        setView('goods');
                                    }}>
                                        goods
                                    </button>
                                    {isAdmin && (
                                        <>
                                            <button className="btn" onClick={() => openEdit(cat)}>
                                                edit
                                            </button>
                                            <button className="btn btn-delete" onClick={() => handleDelete(cat.id)}>
                                                delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {(view === 'form' || view === 'edit') && isAdmin && (
                    <form className="form card" onSubmit={handleSubmit}>
                        <label className="categories__label">
                            Name
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                disabled={view === 'edit'}
                                required
                            />
                        </label>
                        
                        <label className="categories__label">
                            Description
                            <textarea
                                value={form.description}
                                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                rows="4"
                            />
                        </label>

                        {form.goodIds.length > 0 && (
                            <small className="categories__hint">
                                Products in category: {form.goodIds.length}
                            </small>
                        )}

                        <button className="categories__btn categories__btn--primary" type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save'}
                        </button>

                        <div className="select_good_section">
                            <label className="categories__label">
                                Goods for category
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
                        </div>
                    </form>
                )}

                {view === 'goods' && selectedCategory && (
                    <div className="categories__goods-manager">
                        <h2>Goods in «{selectedCategory.name}»</h2>

                        <section className="categories__goods-section">
                            <h3>Add good</h3>
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
                                                + add
                                            </button>
                                        </li>
                                    ))}
                                {goods.filter(g => !categoryGoods.some(cg => cg.id === g.id)).length === 0 && (
                                    <li className="categories__goods-empty">All products added</li>
                                )}
                            </ul>
                        </section>

                        <section className="categories__goods-section">
                            <h3>Already in category</h3>
                            {categoryGoods.length === 0 ? (
                                <p>No products</p>
                            ) : (
                                <ul className="categories__goods-list">
                                    {categoryGoods.map(good => (
                                        <li key={good.id} className="categories__goods-item">
                                            <span>{good.title} — {good.price} ₽</span>
                                            <button
                                                className="categories__link categories__link--danger"
                                                onClick={() => handleRemoveGood(good.id)}
                                            >
                                                − Remove
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    </div>
                )}
            </div>
        </section>
    );
}

