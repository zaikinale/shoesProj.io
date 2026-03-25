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
    
//     const [galleryImages, setGalleryImages] = useState([]);
//     const [newGalleryUrl, setNewGalleryUrl] = useState('');
//     const [galleryError, setGalleryError] = useState(false);
    
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
//                     setGalleryImages(goodData.images || []);
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
//                     setGalleryImages([]);
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

//     const testImage = (url, setIsError) => {
//         if (!url) return;
//         const img = new Image();
//         img.onload = () => {
//             setIsError(false);
//             alert('✓ Image loaded successfully');
//         };
//         img.onerror = () => {
//             setIsError(true);
//             alert('✗ Failed to load image. Check the URL.');
//         };
//         img.src = url;
//     };

//     const clearImage = () => {
//         changeField('image', null);
//         setImagePreview(null);
//         setImageError(false);
//     };

//     const handleAddGalleryImage = () => {
//         if (!newGalleryUrl.trim()) return;
        
//         const newImage = {
//             url: newGalleryUrl.trim(),
//             isMain: galleryImages.length === 0
//         };
        
//         setGalleryImages(prev => [...prev, newImage]);
//         setNewGalleryUrl('');
//         setGalleryError(false);
//     };

//     const handleRemoveGalleryImage = (index) => {
//         setGalleryImages(prev => prev.filter((_, i) => i !== index));
//     };

//     const handleSetMainGalleryImage = (index) => {
//         setGalleryImages(prev => prev.map((img, i) => ({
//             ...img,
//             isMain: i === index
//         })));
//     };

//     const testGalleryImage = (url) => {
//         testImage(url, setGalleryError);
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
//             categoryIds: good.categoryIds,
//             images: galleryImages.map(img => ({
//                 url: img.url,
//                 isMain: img.isMain
//             }))
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
//                                     {imageError ? 'Image not found' : 'No main image'}
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
//                                 placeholder="Main image URL..."
//                                 onChange={(e) => handleImageChange(e.target.value)}
//                             />
//                             <div className="image-actions">
//                                 <button 
//                                     type="button" 
//                                     className="btn-image-test"
//                                     onClick={() => testImage(good.image, setImageError)}
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
//                             {`Rating: ${calculateAverageRating(reviews)}`}
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

//                 <div className="gallery-section">
//                     <h3>Product Gallery</h3>
                    
//                     <div className="gallery-preview">
//                         {galleryImages.length > 0 ? (
//                             galleryImages.map((img, index) => (
//                                 <div key={index} className={`gallery-item ${img.isMain ? 'main' : ''}`}>
//                                     <img src={img.url} alt={`Gallery ${index + 1}`} />
//                                     <div className="gallery-controls">
//                                         <button 
//                                             type="button" 
//                                             className="btn-gallery-action"
//                                             onClick={() => handleSetMainGalleryImage(index)}
//                                             title="Set as main gallery image"
//                                         >
//                                             {img.isMain ? '★' : '☆'}
//                                         </button>
//                                         <button 
//                                             type="button" 
//                                             className="btn-gallery-action btn-delete"
//                                             onClick={() => handleRemoveGalleryImage(index)}
//                                             title="Remove"
//                                         >
//                                             ×
//                                         </button>
//                                     </div>
//                                     {img.isMain && <span className="main-badge">Gallery Main</span>}
//                                 </div>
//                             ))
//                         ) : (
//                             <p className="no-images">No gallery images yet</p>
//                         )}
//                     </div>

//                     <div className="gallery-add">
//                         <input
//                             type="url"
//                             value={newGalleryUrl}
//                             onChange={(e) => setNewGalleryUrl(e.target.value)}
//                             placeholder="Image URL for gallery"
//                             className="image-url-input"
//                         />
//                         <button 
//                             type="button" 
//                             className="btn-image-test"
//                             onClick={() => testGalleryImage(newGalleryUrl)}
//                             disabled={!newGalleryUrl.trim()}
//                         >
//                             Test
//                         </button>
//                         <button 
//                             type="button" 
//                             className="btn-add-image"
//                             onClick={handleAddGalleryImage}
//                             disabled={!newGalleryUrl.trim()}
//                         >
//                             + Add to Gallery
//                         </button>
//                     </div>

//                     <p className="gallery-hint">
//                         Tip: First gallery image will be main. Click ★ to change. Gallery images shown on product page.
//                     </p>
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

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGoodById, updateGood, addGood } from '../../api/goods.js';
import { getCategories } from '../../api/categories.js';
import NavigateTo from '../../utils/navBtn.jsx';
import styles from './GoodEditor.module.css';

export default function GoodEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [good, setGood] = useState(null);
    
    const [imagePreview, setImagePreview] = useState(null);
    const [imageError, setImageError] = useState(false);
    
    const [galleryImages, setGalleryImages] = useState([]);
    const [newGalleryUrl, setNewGalleryUrl] = useState('');
    
    const [categorySearch, setCategorySearch] = useState('');

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
                    setGalleryImages(goodData.images || []);
                } else {
                    setGood({
                        title: '', description: '', price: '', image: '', isActive: true, categoryIds: []
                    });
                }
            } catch (error) {
                navigate('/store');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id, isEditMode, navigate]);

    if (loading || !good) return <div className={styles.loader}>Загрузка редактора...</div>;

    const changeField = (field, value) => setGood(prev => ({ ...prev, [field]: value }));

    const handleImageChange = (url) => {
        changeField('image', url);
        setImagePreview(url);
        setImageError(false);
    };

    const toggleCategory = (categoryId) => {
        setGood(prev => ({
            ...prev,
            categoryIds: prev.categoryIds.includes(categoryId)
                ? prev.categoryIds.filter(id => id !== categoryId)
                : [...prev.categoryIds, categoryId]
        }));
    };

    const handleSave = async () => {
        if (!good.title || !good.price) return alert('Заполните название и цену');
        
        const payload = {
            ...good,
            price: Number(good.price),
            images: galleryImages
        };

        try {
            isEditMode ? await updateGood(Number(id), payload) : await addGood(payload);
            navigate('/store');
        } catch (error) {
            alert('Ошибка при сохранении');
        }
    };

    const filteredCats = categories.filter(c => c.name.toLowerCase().includes(categorySearch.toLowerCase()));

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <div className={styles.navGroup}>
                        <NavigateTo path="store" />
                        <span className={styles.breadcrumb}>/ {isEditMode ? 'Редактирование' : 'Новый товар'}</span>
                    </div>
                    <div className={styles.actions}>
                        <button className={styles.btnCancel} onClick={() => navigate('/store')}>Отмена</button>
                        <button className={styles.btnSave} onClick={handleSave}>
                            {isEditMode ? 'Обновить' : 'Создать'}
                        </button>
                    </div>
                </div>
            </header>

            <main className={styles.container}>
                <div className={styles.grid}>
                    {/* Левая колонка: Визуал */}
                    <section className={styles.visualSection}>
                        <div className={styles.mainImageCard}>
                            <h3>Главное изображение</h3>
                            <div className={styles.previewBox}>
                                {imagePreview && !imageError ? (
                                    <img src={imagePreview} alt="Preview" onError={() => setImageError(true)} />
                                ) : (
                                    <div className={styles.placeholder}>Нет изображения</div>
                                )}
                            </div>
                            <input 
                                type="url" 
                                placeholder="Вставьте прямую ссылку на фото..." 
                                value={good.image || ''} 
                                onChange={(e) => handleImageChange(e.target.value)}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.galleryCard}>
                            <h3>Галерея</h3>
                            <div className={styles.galleryGrid}>
                                {galleryImages.map((img, idx) => (
                                    <div key={idx} className={styles.galleryItem}>
                                        <img src={img.url} alt="Gallery" />
                                        <button onClick={() => setGalleryImages(prev => prev.filter((_, i) => i !== idx))}>×</button>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.addGallery}>
                                <input 
                                    type="url" 
                                    placeholder="Добавить фото в галерею..." 
                                    value={newGalleryUrl} 
                                    onChange={(e) => setNewGalleryUrl(e.target.value)} 
                                />
                                <button onClick={() => {
                                    if(newGalleryUrl) setGalleryImages([...galleryImages, { url: newGalleryUrl, isMain: false }]);
                                    setNewGalleryUrl('');
                                }}>+</button>
                            </div>
                        </div>
                    </section>

                    {/* Правая колонка: Данные */}
                    <section className={styles.dataSection}>
                        <div className={styles.card}>
                            <input 
                                type="text" 
                                className={styles.titleInput} 
                                placeholder="Название товара..." 
                                value={good.title} 
                                onChange={(e) => changeField('title', e.target.value)}
                            />
                            
                            <textarea 
                                className={styles.descInput} 
                                placeholder="Описание..." 
                                value={good.description} 
                                onChange={(e) => changeField('description', e.target.value)}
                            />

                            <div className={styles.row}>
                                <div className={styles.inputGroup}>
                                    <label>Цена (₽)</label>
                                    <input type="number" value={good.price} onChange={(e) => changeField('price', e.target.value)} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Статус</label>
                                    <select value={good.isActive} onChange={(e) => changeField('isActive', e.target.value === 'true')}>
                                        <option value="true">Активен</option>
                                        <option value="false">Скрыт</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className={styles.card}>
                            <h3>Категории</h3>
                            <input 
                                type="text" 
                                className={styles.searchInput} 
                                placeholder="Поиск категорий..." 
                                value={categorySearch} 
                                onChange={(e) => setCategorySearch(e.target.value)}
                            />
                            <div className={styles.catGrid}>
                                {filteredCats.map(cat => (
                                    <button 
                                        key={cat.id} 
                                        className={`${styles.catChip} ${good.categoryIds.includes(cat.id) ? styles.activeCat : ''}`}
                                        onClick={() => toggleCategory(cat.id)}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}