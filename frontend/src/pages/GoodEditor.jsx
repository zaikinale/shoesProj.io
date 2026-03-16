// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getGoodById, updateGood, addGood } from '../api/goods.js';
// import { getCategories } from '../api/categories.js';
// import NavigateTo from '../utils/navBtn.jsx';

// export default function ProductEditor() {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const isEditMode = !!id;

//     const [loading, setLoading] = useState(true);
//     const [categories, setCategories] = useState([]);
//     const [good, setGood] = useState(null);
//     const [isSave, setIsSave] = useState(false);
//     const [reviews, setReviews] = useState([]);

//     // Загрузка данных
//     useEffect(() => {
//         const loadData = async () => {
//             try {
//                 const [goodData, categoriesData] = await Promise.all([
//                     isEditMode ? getGoodById(Number(id)) : Promise.resolve(null),
//                     getCategories()
//                 ]);
                
//                 setCategories(categoriesData);
                
//                 if (isEditMode && goodData) {
//                     setGood({
//                         ...goodData,
//                         categoryIds: goodData.categories?.map(c => c.id) || []
//                     });
//                 } else {
//                     // Новый товар — пустой шаблон
//                     setGood({
//                         id: null,
//                         title: '',
//                         description: '',
//                         price: 0,
//                         image: null,
//                         isActive: true,
//                         categoryIds: []
//                     });
//                 }
//             } catch (error) {
//                 console.error('Error loading data:', error);
//                 alert('Failed to load data');
//                 navigate('/store');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         loadData();
//     }, [id, isEditMode, navigate]);

//     if (loading || !good) return null;

//     // Хендлеры для редактирования полей
//     const changeField = (field, value) => {
//         setGood(prev => ({ ...prev, [field]: value }));
//     };

//     const toggleCategory = (categoryId) => {
//         setGood(prev => {
//             const isSelected = prev.categoryIds.includes(categoryId);
//             return {
//                 ...prev,
//                 categoryIds: isSelected
//                     ? prev.categoryIds.filter(cid => cid !== categoryId)
//                     : [...prev.categoryIds, categoryId]
//             };
//         });
//     };

//     const handleSave = async () => {
//         // Валидация
//         if (!good.title?.trim()) {
//             alert('Title is required');
//             return;
//         }
//         if (!good.description?.trim()) {
//             alert('Description is required');
//             return;
//         }
//         if (!good.price || good.price <= 0) {
//             alert('Valid price is required');
//             return;
//         }

//         const payload = {
//             title: good.title.trim(),
//             description: good.description.trim(),
//             price: Number(good.price),
//             image: good.image?.trim() || null,
//             isActive: good.isActive,
//             categoryIds: good.categoryIds
//         };

//         try {
//             if (isEditMode) {
//                 await updateGood(Number(id), payload);
//                 console.log('Product updated:', payload);
//             } else {
//                 await addGood(payload);
//                 console.log('Product created:', payload);
//             }
//             navigate('/store');
//         } catch (error) {
//             console.error('Error saving product:', error);
//             alert(error.message || 'Failed to save product');
//         }
//     };

//     const handleCancel = () => {
//         navigate('/store');
//     };

//     const calculateAverageRating = (reviews) => {
//         if (!reviews || reviews.length === 0) return "пока что отсутствует.";
//         const total = reviews.reduce((sum, r) => sum + r.rating, 0);
//         return parseFloat((total / reviews.length).toFixed(1));
//     };

//     return (
//         <section className="good">
//             <div className="container">
//                 <div className="head">
//                     <NavigateTo path="store" />
//                     <div className="controllers">
//                         {/* Кнопки сохранения */}
//                         <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
//                         <button className="btn-save" onClick={handleSave}>
//                             {isEditMode ? 'Save Changes' : 'Create Product'}
//                         </button>
//                         <NavigateTo path="profile" />
//                     </div>
//                 </div>

//                 <div className="good-content">
//                     {/* 🔹 Изображение — редактируемое */}
//                     <div className="good-image">
//                         {good.image ? (
//                             <img className="image" src={good.image} alt="Preview" />
//                         ) : (
//                             <div className="image-placeholder">No image</div>
//                         )}
//                         {/* Поле для смены ссылки на изображение */}
//                         <input
//                             type="url"
//                             className="image-url-input"
//                             value={good.image || ''}
//                             placeholder="Image URL"
//                             onChange={(e) => changeField('image', e.target.value)}
//                         />
//                     </div>

//                     {/* 🔹 Информация о товаре — редактируемая */}
//                     <div className="good-info">
//                         {/* Title — input вместо h2 */}
//                         <input
//                             type="text"
//                             className="good-title-input"
//                             value={good.title}
//                             placeholder="Product title"
//                             onChange={(e) => changeField('title', e.target.value)}
//                         />

//                         {/* Description — textarea вместо p */}
//                         <textarea
//                             className="good-description-input"
//                             value={good.description}
//                             placeholder="Product description"
//                             rows="4"
//                             onChange={(e) => changeField('description', e.target.value)}
//                         />

//                         {/* Rating — только просмотр */}
//                         <p className="good-description">
//                             {`Рейтинг: ${calculateAverageRating(reviews)}`}
//                         </p>

//                         {/* Price — input вместо span */}
//                         <div className="good-price">
//                             <span className="price-label">Цена:</span>
//                             <input
//                                 type="number"
//                                 className="price-value-input"
//                                 value={good.price}
//                                 placeholder="0"
//                                 min="0"
//                                 step="0.01"
//                                 onChange={(e) => changeField('price', e.target.value)}
//                             />
//                             <span className="price-currency">₽</span>
//                         </div>

//                         {/* Активность товара */}
//                         <label className="active-toggle">
//                             <input
//                                 type="checkbox"
//                                 checked={good.isActive}
//                                 onChange={(e) => changeField('isActive', e.target.checked)}
//                             />
//                             <span>Product is active (visible in store)</span>
//                         </label>

//                         {/* Категории */}
//                         <div className="categories-edit">
//                             <span>Categories:</span>
//                             <div className="categories-list">
//                                 {categories.map(cat => (
//                                     <label key={cat.id} className="category-chip">
//                                         <input
//                                             type="checkbox"
//                                             checked={good.categoryIds.includes(cat.id)}
//                                             onChange={() => toggleCategory(cat.id)}
//                                         />
//                                         <span>{cat.name}</span>
//                                     </label>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* 🔹 Отзывы — только просмотр (как у клиента) */}
//                 <aside className="reviews">
//                     <h2>Product reviews</h2>
//                     <div className="reviews-container">
//                         {reviews.length > 0 ? (
//                             reviews.map(review => (
//                                 <div className="review-card" key={review.id}>
//                                     <img 
//                                         src={review.image || 'https://via.placeholder.com/40'} 
//                                         alt={`${review.user?.username || 'User'}'s avatar`} 
//                                     />
//                                     <p>{review.text}</p>
//                                     <div className="rating">{review.rating}</div>
//                                 </div>
//                             ))
//                         ) : (
//                             <p>There are no reviews for this product yet</p>
//                         )}
//                     </div>
//                 </aside>
//             </div>
//         </section>
//     );
// }

// pages/ProductEditor.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGoodById, updateGood, addGood } from '../api/goods.js';
import { getCategories } from '../api/categories.js';
import NavigateTo from '../utils/navBtn.jsx';

export default function ProductEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [good, setGood] = useState(null);
    const [reviews, setReviews] = useState([]);
    
    // Интерактивные состояния
    const [imagePreview, setImagePreview] = useState(null);
    const [imageError, setImageError] = useState(false);
    const [categorySearch, setCategorySearch] = useState('');
    const [showAllCategories, setShowAllCategories] = useState(false);

    // Загрузка данных
    useEffect(() => {
        const loadData = async () => {
            try {
                const [goodData, categoriesData] = await Promise.all([
                    isEditMode ? getGoodById(Number(id)) : Promise.resolve(null),
                    getCategories()
                ]);
                
                setCategories(categoriesData);
                
                if (isEditMode && goodData) {
                    setGood({
                        ...goodData,
                        categoryIds: goodData.categories?.map(c => c.id) || []
                    });
                    setImagePreview(goodData.image);
                } else {
                    setGood({
                        id: null,
                        title: '',
                        description: '',
                        price: 0,
                        image: null,
                        isActive: true,
                        categoryIds: []
                    });
                }
            } catch (error) {
                console.error('Error loading data:', error);
                alert('Failed to load data');
                navigate('/store');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id, isEditMode, navigate]);

    if (loading || !good) return null;

    // 🔹 Хендлеры для полей товара
    const changeField = (field, value) => {
        setGood(prev => ({ ...prev, [field]: value }));
    };

    // 🔹 Интерактивное редактирование изображения
    const handleImageChange = (url) => {
        changeField('image', url);
        setImagePreview(url);
        setImageError(false);
    };

    const testImage = () => {
        if (!good.image) return;
        const img = new Image();
        img.onload = () => {
            setImageError(false);
            alert('✓ Image loaded successfully');
        };
        img.onerror = () => {
            setImageError(true);
            alert('✗ Failed to load image. Check the URL.');
        };
        img.src = good.image;
    };

    const clearImage = () => {
        changeField('image', null);
        setImagePreview(null);
        setImageError(false);
    };

    // 🔹 Интерактивный выбор категорий
    const toggleCategory = (categoryId) => {
        setGood(prev => {
            const isSelected = prev.categoryIds.includes(categoryId);
            return {
                ...prev,
                categoryIds: isSelected
                    ? prev.categoryIds.filter(cid => cid !== categoryId)
                    : [...prev.categoryIds, categoryId]
            };
        });
    };

    const filteredCategories = categories.filter(cat => 
        cat.name.toLowerCase().includes(categorySearch.toLowerCase())
    );

    const displayedCategories = showAllCategories 
        ? filteredCategories 
        : filteredCategories.slice(0, 6);

    const selectedCategories = categories.filter(c => good.categoryIds.includes(c.id));

    // 🔹 Сохранение
    const handleSave = async () => {
        if (!good.title?.trim()) { alert('Title is required'); return; }
        if (!good.description?.trim()) { alert('Description is required'); return; }
        if (!good.price || good.price <= 0) { alert('Valid price is required'); return; }

        const payload = {
            title: good.title.trim(),
            description: good.description.trim(),
            price: Number(good.price),
            image: good.image?.trim() || null,
            isActive: good.isActive,
            categoryIds: good.categoryIds
        };

        try {
            if (isEditMode) {
                await updateGood(Number(id), payload);
            } else {
                await addGood(payload);
            }
            navigate('/store');
        } catch (error) {
            console.error('Error saving product:', error);
            alert(error.message || 'Failed to save product');
        }
    };

    const handleCancel = () => navigate('/store');

    const calculateAverageRating = (reviews) => {
        if (!reviews?.length) return "пока что отсутствует.";
        const total = reviews.reduce((sum, r) => sum + r.rating, 0);
        return parseFloat((total / reviews.length).toFixed(1));
    };

    return (
        <section className="good">
            <div className="container">
                <div className="head">
                    <NavigateTo path="store" />
                    <div className="controllers">
                        <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
                        <button className="btn-save" onClick={handleSave}>
                            {isEditMode ? 'Save Changes' : 'Create Product'}
                        </button>
                        <NavigateTo path="profile" />
                    </div>
                </div>

                <div className="good-content">
                    {/* 🔹 Изображение с интерактивным редактором */}
                    <div className="good-image">
                        <div className="image-wrapper">
                            {imagePreview && !imageError ? (
                                <img 
                                    className="image" 
                                    src={imagePreview} 
                                    alt="Preview"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <div className="image-placeholder">
                                    {imageError ? '❌ Image not found' : 'No image'}
                                </div>
                            )}
                            
                            {/* Индикатор статуса */}
                            {good.image && (
                                <span className={`image-status ${imageError ? 'error' : 'ok'}`}>
                                    {imageError ? 'Broken link' : 'Loaded'}
                                </span>
                            )}
                        </div>

                        {/* Поле ввода URL + кнопки */}
                        <div className="image-controls">
                            <input
                                type="url"
                                className="image-url-input"
                                value={good.image || ''}
                                placeholder="Paste image URL here..."
                                onChange={(e) => handleImageChange(e.target.value)}
                            />
                            <div className="image-actions">
                                <button 
                                    type="button" 
                                    className="btn-image-test"
                                    onClick={testImage}
                                    disabled={!good.image}
                                >
                                    Test
                                </button>
                                <button 
                                    type="button" 
                                    className="btn-image-clear"
                                    onClick={clearImage}
                                    disabled={!good.image}
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        {/* Подсказка */}
                        <p className="image-hint">
                            Tip: Paste a direct image link (.jpg, .png, .webp)
                        </p>
                    </div>

                    {/* 🔹 Информация о товаре */}
                    <div className="good-info">
                        <input
                            type="text"
                            className="good-title-input"
                            value={good.title}
                            placeholder="Product title *"
                            onChange={(e) => changeField('title', e.target.value)}
                        />

                        <textarea
                            className="good-description-input"
                            value={good.description}
                            placeholder="Product description *"
                            rows="4"
                            onChange={(e) => changeField('description', e.target.value)}
                        />

                        <p className="good-description">
                            {`Рейтинг: ${calculateAverageRating(reviews)}`}
                        </p>

                        <div className="good-price">
                            <span className="price-label">Цена:</span>
                            <input
                                type="number"
                                className="price-value-input"
                                value={good.price}
                                placeholder="0"
                                min="0"
                                step="0.01"
                                onChange={(e) => changeField('price', e.target.value)}
                            />
                            <span className="price-currency">₽</span>
                        </div>

                        {/* Активность */}
                        <label className="active-toggle">
                            <input
                                type="checkbox"
                                checked={good.isActive}
                                onChange={(e) => changeField('isActive', e.target.checked)}
                            />
                            <span>Product is active (visible in store)</span>
                        </label>

                        {/* 🔹 Интерактивный выбор категорий */}
                        <div className="categories-editor">
                            <div className="categories-header">
                                <span>Categories</span>
                                {selectedCategories.length > 0 && (
                                    <span className="categories-count">
                                        {selectedCategories.length} selected
                                    </span>
                                )}
                            </div>

                            {/* Выбранные категории — чипсы с возможностью удаления */}
                            {selectedCategories.length > 0 && (
                                <div className="selected-categories">
                                    {selectedCategories.map(cat => (
                                        <span key={cat.id} className="category-chip selected">
                                            {cat.name}
                                            <button 
                                                type="button"
                                                className="chip-remove"
                                                onClick={() => toggleCategory(cat.id)}
                                                title="Remove"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Поиск категорий */}
                            <div className="category-search-box">
                                <input
                                    type="text"
                                    className="category-search-input"
                                    value={categorySearch}
                                    placeholder="Search categories..."
                                    onChange={(e) => setCategorySearch(e.target.value)}
                                />
                                {categorySearch && (
                                    <button 
                                        type="button" 
                                        className="search-clear"
                                        onClick={() => setCategorySearch('')}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>

                            {/* Список доступных категорий */}
                            <div className="available-categories">
                                {displayedCategories.map(cat => {
                                    const isSelected = good.categoryIds.includes(cat.id);
                                    return (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            className={`category-option ${isSelected ? 'selected' : ''}`}
                                            onClick={() => toggleCategory(cat.id)}
                                        >
                                            <span className="category-checkbox">
                                                {isSelected ? '✓' : '+'}
                                            </span>
                                            <span className="category-name">{cat.name}</span>
                                            {isSelected && <span className="category-check">✓</span>}
                                        </button>
                                    );
                                })}
                                
                                {filteredCategories.length > 6 && (
                                    <button
                                        type="button"
                                        className="show-more-categories"
                                        onClick={() => setShowAllCategories(!showAllCategories)}
                                    >
                                        {showAllCategories ? 'Show less' : `Show all (${filteredCategories.length})`}
                                    </button>
                                )}
                                
                                {filteredCategories.length === 0 && (
                                    <p className="no-categories">No categories found</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Отзывы — только просмотр */}
                <aside className="reviews">
                    <h2>Product reviews</h2>
                    <div className="reviews-container">
                        {reviews.length > 0 ? (
                            reviews.map(review => (
                                <div className="review-card" key={review.id}>
                                    <img 
                                        src={review.image || 'https://via.placeholder.com/40'} 
                                        alt="avatar" 
                                    />
                                    <p>{review.text}</p>
                                    <div className="rating">{review.rating}</div>
                                </div>
                            ))
                        ) : (
                            <p>There are no reviews for this product yet</p>
                        )}
                    </div>
                </aside>
            </div>
        </section>
    );
}