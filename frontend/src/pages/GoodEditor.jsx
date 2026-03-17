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
//     const [reviews, setReviews] = useState([]);
    
//     const [imagePreview, setImagePreview] = useState(null);
//     const [imageError, setImageError] = useState(false);
//     const [categorySearch, setCategorySearch] = useState('');
//     const [showAllCategories, setShowAllCategories] = useState(false);

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
//                     setImagePreview(goodData.image);
//                 } else {
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

//     const changeField = (field, value) => {
//         setGood(prev => ({ ...prev, [field]: value }));
//     };

//     const handleImageChange = (url) => {
//         changeField('image', url);
//         setImagePreview(url);
//         setImageError(false);
//     };

//     const testImage = () => {
//         if (!good.image) return;
//         const img = new Image();
//         img.onload = () => {
//             setImageError(false);
//             alert('Image loaded successfully');
//         };
//         img.onerror = () => {
//             setImageError(true);
//             alert('Failed to load image. Check the URL.');
//         };
//         img.src = good.image;
//     };

//     const clearImage = () => {
//         changeField('image', null);
//         setImagePreview(null);
//         setImageError(false);
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

//     const filteredCategories = categories.filter(cat => 
//         cat.name.toLowerCase().includes(categorySearch.toLowerCase())
//     );

//     const displayedCategories = showAllCategories 
//         ? filteredCategories 
//         : filteredCategories.slice(0, 6);

//     const selectedCategories = categories.filter(c => good.categoryIds.includes(c.id));

//     const handleSave = async () => {
//         if (!good.title?.trim()) { alert('Title is required'); return; }
//         if (!good.description?.trim()) { alert('Description is required'); return; }
//         if (!good.price || good.price <= 0) { alert('Valid price is required'); return; }

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
//             } else {
//                 await addGood(payload);
//             }
//             navigate('/store');
//         } catch (error) {
//             console.error('Error saving product:', error);
//             alert(error.message || 'Failed to save product');
//         }
//     };

//     const handleCancel = () => navigate('/store');

//     const calculateAverageRating = (reviews) => {
//         if (!reviews?.length) return "not yet available.";
//         const total = reviews.reduce((sum, r) => sum + r.rating, 0);
//         return parseFloat((total / reviews.length).toFixed(1));
//     };

//     return (
//         <section className="good">
//             <div className="container">
//                 <div className="head">
//                     <NavigateTo path="store" />
//                     <div className="controllers">
//                         <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
//                         <button className="btn-save" onClick={handleSave}>
//                             {isEditMode ? 'Save Changes' : 'Create Product'}
//                         </button>
//                         <NavigateTo path="profile" />
//                     </div>
//                 </div>

//                 <div className="good-content">
//                     <div className="good-image">
//                         <div className="image-wrapper">
//                             {imagePreview && !imageError ? (
//                                 <img 
//                                     className="image" 
//                                     src={imagePreview} 
//                                     alt="Preview"
//                                     onError={() => setImageError(true)}
//                                 />
//                             ) : (
//                                 <div className="image-placeholder">
//                                     {imageError ? 'Image not found' : 'No image'}
//                                 </div>
//                             )}
                            
//                             {good.image && (
//                                 <span className={`image-status ${imageError ? 'error' : 'ok'}`}>
//                                     {imageError ? 'Broken link' : 'Loaded'}
//                                 </span>
//                             )}
//                         </div>

//                         <div className="image-controls">
//                             <input
//                                 type="url"
//                                 className="image-url-input"
//                                 value={good.image || ''}
//                                 placeholder="Paste image URL here..."
//                                 onChange={(e) => handleImageChange(e.target.value)}
//                             />
//                             <div className="image-actions">
//                                 <button 
//                                     type="button" 
//                                     className="btn-image-test"
//                                     onClick={testImage}
//                                     disabled={!good.image}
//                                 >
//                                     Test
//                                 </button>
//                                 <button 
//                                     type="button" 
//                                     className="btn-image-clear"
//                                     onClick={clearImage}
//                                     disabled={!good.image}
//                                 >
//                                     Clear
//                                 </button>
//                             </div>
//                         </div>

//                         <p className="image-hint">
//                             Tip: Paste a direct image link (.jpg, .png, .webp)
//                         </p>
//                     </div>

//                     <div className="good-info">
//                         <input
//                             type="text"
//                             className="good-title-input"
//                             value={good.title}
//                             placeholder="Product title *"
//                             onChange={(e) => changeField('title', e.target.value)}
//                         />

//                         <textarea
//                             className="good-description-input"
//                             value={good.description}
//                             placeholder="Product description *"
//                             rows="4"
//                             onChange={(e) => changeField('description', e.target.value)}
//                         />

//                         <p className="good-description">
//                             {`Renting: ${calculateAverageRating(reviews)}`}
//                         </p>

//                         <div className="good-price">
//                             <span className="price-label">Price:</span>
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

//                         <label className="active-toggle">
//                             <input
//                                 type="checkbox"
//                                 checked={good.isActive}
//                                 onChange={(e) => changeField('isActive', e.target.checked)}
//                             />
//                             <span>Product is active (visible in store)</span>
//                         </label>

//                         <div className="categories-editor">
//                             <div className="categories-header">
//                                 <span>Categories</span>
//                                 {selectedCategories.length > 0 && (
//                                     <span className="categories-count">
//                                         {selectedCategories.length} selected
//                                     </span>
//                                 )}
//                             </div>

//                             {selectedCategories.length > 0 && (
//                                 <div className="selected-categories">
//                                     {selectedCategories.map(cat => (
//                                         <span key={cat.id} className="category-chip selected">
//                                             {cat.name}
//                                             <button 
//                                                 type="button"
//                                                 className="chip-remove"
//                                                 onClick={() => toggleCategory(cat.id)}
//                                                 title="Remove"
//                                             >
//                                                 ×
//                                             </button>
//                                         </span>
//                                     ))}
//                                 </div>
//                             )}

//                             <div className="category-search-box">
//                                 <input
//                                     type="text"
//                                     className="category-search-input"
//                                     value={categorySearch}
//                                     placeholder="Search categories..."
//                                     onChange={(e) => setCategorySearch(e.target.value)}
//                                 />
//                                 {categorySearch && (
//                                     <button 
//                                         type="button" 
//                                         className="search-clear"
//                                         onClick={() => setCategorySearch('')}
//                                     >
//                                         ×
//                                     </button>
//                                 )}
//                             </div>

//                             <div className="available-categories">
//                                 {displayedCategories.map(cat => {
//                                     const isSelected = good.categoryIds.includes(cat.id);
//                                     return (
//                                         <button
//                                             key={cat.id}
//                                             type="button"
//                                             className={`category-option ${isSelected ? 'selected' : ''}`}
//                                             onClick={() => toggleCategory(cat.id)}
//                                         >
//                                             <span className="category-checkbox">
//                                                 {isSelected ? '✓' : '+'}
//                                             </span>
//                                             <span className="category-name">{cat.name}</span>
//                                             {isSelected && <span className="category-check">✓</span>}
//                                         </button>
//                                     );
//                                 })}
                                
//                                 {filteredCategories.length > 6 && (
//                                     <button
//                                         type="button"
//                                         className="show-more-categories"
//                                         onClick={() => setShowAllCategories(!showAllCategories)}
//                                     >
//                                         {showAllCategories ? 'Show less' : `Show all (${filteredCategories.length})`}
//                                     </button>
//                                 )}
                                
//                                 {filteredCategories.length === 0 && (
//                                     <p className="no-categories">No categories found</p>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <aside className="reviews">
//                     <h2>Product reviews</h2>
//                     <div className="reviews-container">
//                         {reviews.length > 0 ? (
//                             reviews.map(review => (
//                                 <div className="review-card" key={review.id}>
//                                     <img 
//                                         src={review.image || 'https://via.placeholder.com/40'} 
//                                         alt="avatar" 
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
    
    // Основное изображение
    const [imagePreview, setImagePreview] = useState(null);
    const [imageError, setImageError] = useState(false);
    
    // 🔹 Галерея изображений
    const [galleryImages, setGalleryImages] = useState([]);
    const [newGalleryUrl, setNewGalleryUrl] = useState('');
    const [galleryError, setGalleryError] = useState(false);
    
    // Категории
    const [categorySearch, setCategorySearch] = useState('');
    const [showAllCategories, setShowAllCategories] = useState(false);

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
                    // 🔹 Загружаем галерею
                    setGalleryImages(goodData.images || []);
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
                    setGalleryImages([]);
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

    // 🔹 Основное изображение
    const handleImageChange = (url) => {
        changeField('image', url);
        setImagePreview(url);
        setImageError(false);
    };

    const testImage = (url, setIsError) => {
        if (!url) return;
        const img = new Image();
        img.onload = () => {
            setIsError(false);
            alert('✓ Image loaded successfully');
        };
        img.onerror = () => {
            setIsError(true);
            alert('✗ Failed to load image. Check the URL.');
        };
        img.src = url;
    };

    const clearImage = () => {
        changeField('image', null);
        setImagePreview(null);
        setImageError(false);
    };

    // 🔹 Галерея изображений
    const handleAddGalleryImage = () => {
        if (!newGalleryUrl.trim()) return;
        
        const newImage = {
            url: newGalleryUrl.trim(),
            isMain: galleryImages.length === 0 // первое — главное по умолчанию
        };
        
        setGalleryImages(prev => [...prev, newImage]);
        setNewGalleryUrl('');
        setGalleryError(false);
    };

    const handleRemoveGalleryImage = (index) => {
        setGalleryImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSetMainGalleryImage = (index) => {
        setGalleryImages(prev => prev.map((img, i) => ({
            ...img,
            isMain: i === index
        })));
    };

    const testGalleryImage = (url) => {
        testImage(url, setGalleryError);
    };

    // 🔹 Категории
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

    // 🔹 Сохранение товара с галереей
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
            categoryIds: good.categoryIds,
            // 🔹 Отправляем галерею
            images: galleryImages.map(img => ({
                url: img.url,
                isMain: img.isMain
            }))
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
        if (!reviews?.length) return "not yet available.";
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
                    {/* 🔹 Основное изображение */}
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
                                    {imageError ? 'Image not found' : 'No main image'}
                                </div>
                            )}
                            
                            {good.image && (
                                <span className={`image-status ${imageError ? 'error' : 'ok'}`}>
                                    {imageError ? 'Broken link' : 'Loaded'}
                                </span>
                            )}
                        </div>

                        <div className="image-controls">
                            <input
                                type="url"
                                className="image-url-input"
                                value={good.image || ''}
                                placeholder="Main image URL..."
                                onChange={(e) => handleImageChange(e.target.value)}
                            />
                            <div className="image-actions">
                                <button 
                                    type="button" 
                                    className="btn-image-test"
                                    onClick={() => testImage(good.image, setImageError)}
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
                            {`Rating: ${calculateAverageRating(reviews)}`}
                        </p>

                        <div className="good-price">
                            <span className="price-label">Price:</span>
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

                        <label className="active-toggle">
                            <input
                                type="checkbox"
                                checked={good.isActive}
                                onChange={(e) => changeField('isActive', e.target.checked)}
                            />
                            <span>Product is active (visible in store)</span>
                        </label>

                        {/* 🔹 Категории */}
                        <div className="categories-editor">
                            <div className="categories-header">
                                <span>Categories</span>
                                {selectedCategories.length > 0 && (
                                    <span className="categories-count">
                                        {selectedCategories.length} selected
                                    </span>
                                )}
                            </div>

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

                {/* 🔹 Галерея изображений — новая секция */}
                <div className="gallery-section">
                    <h3>Product Gallery</h3>
                    
                    {/* Превью галереи */}
                    <div className="gallery-preview">
                        {galleryImages.length > 0 ? (
                            galleryImages.map((img, index) => (
                                <div key={index} className={`gallery-item ${img.isMain ? 'main' : ''}`}>
                                    <img src={img.url} alt={`Gallery ${index + 1}`} />
                                    <div className="gallery-controls">
                                        <button 
                                            type="button" 
                                            className="btn-gallery-action"
                                            onClick={() => handleSetMainGalleryImage(index)}
                                            title="Set as main gallery image"
                                        >
                                            {img.isMain ? '★' : '☆'}
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn-gallery-action btn-delete"
                                            onClick={() => handleRemoveGalleryImage(index)}
                                            title="Remove"
                                        >
                                            ×
                                        </button>
                                    </div>
                                    {img.isMain && <span className="main-badge">Gallery Main</span>}
                                </div>
                            ))
                        ) : (
                            <p className="no-images">No gallery images yet</p>
                        )}
                    </div>

                    {/* Добавление нового изображения в галерею */}
                    <div className="gallery-add">
                        <input
                            type="url"
                            value={newGalleryUrl}
                            onChange={(e) => setNewGalleryUrl(e.target.value)}
                            placeholder="Image URL for gallery"
                            className="image-url-input"
                        />
                        <button 
                            type="button" 
                            className="btn-image-test"
                            onClick={() => testGalleryImage(newGalleryUrl)}
                            disabled={!newGalleryUrl.trim()}
                        >
                            Test
                        </button>
                        <button 
                            type="button" 
                            className="btn-add-image"
                            onClick={handleAddGalleryImage}
                            disabled={!newGalleryUrl.trim()}
                        >
                            + Add to Gallery
                        </button>
                    </div>

                    <p className="gallery-hint">
                        Tip: First gallery image will be main. Click ★ to change. Gallery images shown on product page.
                    </p>
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