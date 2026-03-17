// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getGoodById } from '../api/goods';
// import { getCategoriesByGoodId } from '../api/categories';
// import NavigateTo from '../utils/navBtn.jsx';
// import { addGood } from '../api/basket.js';
// import { createReview, getReviewsByGoodId, checkIfReviewed } from '../api/reviews.js';
// import { checkIfSaved, removeSavedGood, saveGood } from '../api/saves.js';
// import BookMarkActive from '../assets/bookmark_active.svg';
// import BookMarkUnActive from '../assets/bookmark_unactive.svg';

// export default function Good() {
//     const [good, setGood] = useState(null);
//     const [categories, setCategories] = useState([]);
//     const [isSave, setIsSave] = useState(false);
//     const [reviews, setReviews] = useState([]);
//     const [hasReviewed, setHasReviewed] = useState(false);
//     const [reviewText, setReviewText] = useState('');
//     const [reviewImage, setReviewImage] = useState('');
//     const [reviewRating, setReviewRating] = useState('');
//     const [isUser, setIsUser] = useState(false);
//     const { id } = useParams();
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (id) {
//             const fetchGood = async () => {
//                 try {
//                     const goodData = await getGoodById(Number(id));
//                     setGood(goodData);
//                 } catch (error) {
//                     console.error('Error loading good:', error);
//                 }
//             };
//             fetchGood();
//         }
//     }, [id]);

//     useEffect(() => {
//         if (good?.id) {
//             const loadCategories = async () => {
//                 try {
//                     const cats = await getCategoriesByGoodId(good.id);
//                     setCategories(cats);
//                 } catch (error) {
//                     console.error('Error loading categories:', error);
//                 }
//             };
//             loadCategories();

//             const loadSaveStatus = async () => {
//                 try {
//                     const resp = await checkIfSaved(good.id);
//                     setIsSave(resp);
//                     setIsUser(true);
//                 } catch (error) {
//                     console.error('Error loading save status:', error);
//                 }
//             };

//             const loadReviews = async () => {
//                 try {
//                     const resp = await getReviewsByGoodId(good.id);
//                     setReviews(resp);
//                 } catch (error) {
//                     console.error('Error loading reviews:', error);
//                 }
//             };

//             const loadReviewStatus = async () => {
//                 try {
//                     const resp = await checkIfReviewed(good.id);
//                     setHasReviewed(resp);
//                 } catch (error) {
//                     console.error('Error loading review status:', error);
//                     setHasReviewed(true);
//                 }
//             };

//             loadSaveStatus();
//             loadReviews();
//             loadReviewStatus();
//         }
//     }, [good?.id]);

//     if (!good) return null;

//     const handleAddSaveGood = async () => {
//         try {
//             await saveGood(good.id);
//             setIsSave(true);
//         } catch (error) {
//             console.error('Error saving good:', error);
//         }
//     };

//     const handleRemoveSaveGood = async () => {
//         try {
//             await removeSavedGood(good.id);
//             setIsSave(false);
//         } catch (error) {
//             console.error('Error removing saved good:', error);
//         }
//     };

//     const handleAddToBasket = async () => {
//         try {
//             await addGood(Number(good.id));
//             setGood(prev => ({ ...prev, isInBasket: true }));
//         } catch (error) {
//             console.error('Add to basket error:', error);
//         }
//     };

//     const handleAddReview = async () => {
//         const rating = Number(reviewRating);
//         if (!reviewText.trim()) {
//             alert('Please enter review text');
//             return;
//         }
//         if (isNaN(rating) || rating < 1 || rating > 5) {
//             alert('Rating must be a number from 1 to 5');
//             return;
//         }
//         try {
//             await createReview(good.id, reviewText.trim(), rating, reviewImage || null);
//             setReviewText('');
//             setReviewImage('');
//             setReviewRating('');
//             setHasReviewed(true);
//             const updatedReviews = await getReviewsByGoodId(good.id);
//             setReviews(updatedReviews);
//             console.log('Review added successfully');
//         } catch (error) {
//             console.error('Error adding review:', error);
//             alert(error.message || 'Failed to add review');
//         }
//     };

//     const renderReview = (review) => (
//         <div className="review-card" key={review.id}>
//             <img 
//                 src={review.image || 'https://via.placeholder.com/40'} 
//                 alt={`${review.user?.username || 'User'}'s avatar`} 
//             />
//             <p>{review.text}</p>
//             <div className="rating">{review.rating}</div>
//         </div>
//     );

//     const calculateAverageRating = (reviews) => {
//         if (!reviews || reviews.length === 0) return "пока что отсутствует.";
//         const total = reviews.reduce((sum, r) => sum + r.rating, 0);
//         return parseFloat((total / reviews.length).toFixed(1));
//     };

//     const handleCategoryClick = (categoryId) => {
//         navigate(`/categories/${categoryId}`);
//     };

//     return (
//         <section className="good">
//             <div className="container">
//                 <div className="head">
//                     <NavigateTo path="store" />
//                     <div className="controllers">
//                         <NavigateTo path="basket" />
//                         <NavigateTo path="orders" />
//                         <NavigateTo path="profile" />
//                     </div>
//                 </div>

//                 <div className="good-content">
//                     <div className="good-image">
//                         {good.image ? (
//                             <img 
//                                 className="image"
//                                 src={good.image} 
//                                 alt={good.title}
//                                 onError={(e) => {
//                                     e.target.style.display = 'none';
//                                     e.target.parentElement.innerHTML = 
//                                         '<div class="image-placeholder">Image not available</div>';
//                                 }}
//                             />
//                         ) : (
//                             <div className="image-placeholder">Image not available</div>
//                         )}
//                     </div>

//                     <div className="good-info">
//                         <h2 className="good-title">{good.title}</h2>
                        
//                         {categories.length > 0 && (
//                             <div className="good-categories">
//                                 {categories.map(cat => (
//                                     <button
//                                         key={cat.id}
//                                         className="category-chip"
//                                         onClick={() => handleCategoryClick(cat.id)}
//                                         title={`Show all in ${cat.name}`}
//                                     >
//                                         {cat.name}
//                                     </button>
//                                 ))}
//                             </div>
//                         )}
                        
//                         <p className="good-description">
//                             {`Description: ${good.description || 'No description'}`}
//                         </p>
                        
//                         <p className="good-description">
//                             {`Рейтинг: ${calculateAverageRating(reviews)}`}
//                         </p>
                        
//                         <div className="good-price">
//                             <span className="price-value">{`Price: ${good.price} ₽`}</span>
//                         </div>
                        
//                         {isUser && (
//                             <div className="controls">
//                                 {good.isInBasket ? (
//                                     <NavigateTo path="basket" />
//                                 ) : (
//                                     <button className="btn-add-to-basket" onClick={handleAddToBasket}>
//                                         add to basket
//                                     </button>
//                                 )}
//                                 <button
//                                     className="saveBtn"
//                                     onClick={isSave ? handleRemoveSaveGood : handleAddSaveGood}
//                                 >
//                                     <img
//                                         src={isSave ? BookMarkActive : BookMarkUnActive}
//                                         alt={isSave ? 'Delete from saved' : 'Save'}
//                                     />
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 <aside className="reviews">
//                     <h2>Product reviews</h2>
//                     <div className="reviews-container">
//                         {reviews.length > 0 ? (
//                             reviews.map(renderReview)
//                         ) : (
//                             <p>There are no reviews for this product yet</p>
//                         )}
//                     </div>
                    
//                     {!hasReviewed && (
//                         <div className="added-review">
//                             <h2>Add your review!</h2>
//                             <textarea 
//                                 value={reviewText}
//                                 onChange={(e) => setReviewText(e.target.value)}
//                                 placeholder='Your review'
//                                 rows="4"
//                             />
//                             <div className="controls">
//                                 <input 
//                                     type="text" 
//                                     value={reviewImage}
//                                     onChange={(e) => setReviewImage(e.target.value)}
//                                     placeholder='Image link (optional)' 
//                                 />
//                                 <input 
//                                     className="rating-input" 
//                                     type="number" 
//                                     value={reviewRating}
//                                     onChange={(e) => setReviewRating(e.target.value)}
//                                     placeholder='Rating (1-5)' 
//                                     min="1" 
//                                     max="5"
//                                 />
//                                 <button 
//                                     className="submit" 
//                                     onClick={handleAddReview}
//                                 >
//                                     Add review
//                                 </button>
//                             </div>
//                         </div>
//                     )}
//                 </aside>
//             </div>
//         </section>
//     );
// }

// pages/Good.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGoodById } from '../api/goods';
import { getCategoriesByGoodId } from '../api/categories';
import NavigateTo from '../utils/navBtn.jsx';
import { addGood } from '../api/basket.js';
import { createReview, getReviewsByGoodId, checkIfReviewed } from '../api/reviews.js';
import { checkIfSaved, removeSavedGood, saveGood } from '../api/saves.js';
import BookMarkActive from '../assets/bookmark_active.svg';
import BookMarkUnActive from '../assets/bookmark_unactive.svg';

export default function Good() {
    const [good, setGood] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isSave, setIsSave] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [reviewImage, setReviewImage] = useState('');
    const [reviewRating, setReviewRating] = useState('');
    const [isUser, setIsUser] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    // 🔹 Состояние для галереи
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (id) {
            const fetchGood = async () => {
                try {
                    const goodData = await getGoodById(Number(id));
                    setGood(goodData);
                } catch (error) {
                    console.error('Error loading good:', error);
                }
            };
            fetchGood();
        }
    }, [id]);

    useEffect(() => {
        if (good?.id) {
            const loadCategories = async () => {
                try {
                    const cats = await getCategoriesByGoodId(good.id);
                    setCategories(cats);
                } catch (error) {
                    console.error('Error loading categories:', error);
                }
            };
            loadCategories();

            const loadSaveStatus = async () => {
                try {
                    const resp = await checkIfSaved(good.id);
                    setIsSave(resp);
                    setIsUser(true);
                } catch (error) {
                    console.error('Error loading save status:', error);
                }
            };

            const loadReviews = async () => {
                try {
                    const resp = await getReviewsByGoodId(good.id);
                    setReviews(resp);
                } catch (error) {
                    console.error('Error loading reviews:', error);
                }
            };

            const loadReviewStatus = async () => {
                try {
                    const resp = await checkIfReviewed(good.id);
                    setHasReviewed(resp);
                } catch (error) {
                    console.error('Error loading review status:', error);
                    setHasReviewed(true);
                }
            };

            loadSaveStatus();
            loadReviews();
            loadReviewStatus();
        }
    }, [good?.id]);

    if (!good) return null;

    // 🔹 Собираем все изображения в один массив для галереи
    // Приоритет: изображения из галереи (с флагом isMain) -> основное изображение товара
    const allImages = [
        ...(good.images?.filter(img => img.url !== good.image) || []),
        ...(good.image ? [{ url: good.image, isMain: true }] : [])
    ];

    // Если есть изображения с isMain в галерее, ставим их первыми
    const mainGalleryImage = allImages.find(img => img.isMain);
    const otherImages = allImages.filter(img => !img.isMain);
    const displayImages = mainGalleryImage ? [mainGalleryImage, ...otherImages] : allImages;

    const handleAddSaveGood = async () => {
        try {
            await saveGood(good.id);
            setIsSave(true);
        } catch (error) {
            console.error('Error saving good:', error);
        }
    };

    const handleRemoveSaveGood = async () => {
        try {
            await removeSavedGood(good.id);
            setIsSave(false);
        } catch (error) {
            console.error('Error removing saved good:', error);
        }
    };

    const handleAddToBasket = async () => {
        try {
            await addGood(Number(good.id));
            setGood(prev => ({ ...prev, isInBasket: true }));
        } catch (error) {
            console.error('Add to basket error:', error);
        }
    };

    const handleAddReview = async () => {
        const rating = Number(reviewRating);
        if (!reviewText.trim()) {
            alert('Please enter review text');
            return;
        }
        if (isNaN(rating) || rating < 1 || rating > 5) {
            alert('Rating must be a number from 1 to 5');
            return;
        }
        try {
            await createReview(good.id, reviewText.trim(), rating, reviewImage || null);
            setReviewText('');
            setReviewImage('');
            setReviewRating('');
            setHasReviewed(true);
            const updatedReviews = await getReviewsByGoodId(good.id);
            setReviews(updatedReviews);
            console.log('Review added successfully');
        } catch (error) {
            console.error('Error adding review:', error);
            alert(error.message || 'Failed to add review');
        }
    };

    const renderReview = (review) => (
        <div className="review-card" key={review.id}>
            <img 
                src={review.image || 'https://via.placeholder.com/40'} 
                alt={`${review.user?.username || 'User'}'s avatar`} 
            />
            <p>{review.text}</p>
            <div className="rating">{review.rating}</div>
        </div>
    );

    const calculateAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) return "пока что отсутствует.";
        const total = reviews.reduce((sum, r) => sum + r.rating, 0);
        return parseFloat((total / reviews.length).toFixed(1));
    };

    const handleCategoryClick = (categoryId) => {
        navigate(`/categories/${categoryId}`);
    };

    // 🔹 Навигация по галерее
    const prevImage = () => {
        setCurrentImageIndex(i => i === 0 ? displayImages.length - 1 : i - 1);
    };

    const nextImage = () => {
        setCurrentImageIndex(i => i === displayImages.length - 1 ? 0 : i + 1);
    };

    return (
        <section className="good">
            <div className="container">
                <div className="head">
                    <NavigateTo path="store" />
                    <div className="controllers">
                        <NavigateTo path="basket" />
                        <NavigateTo path="orders" />
                        <NavigateTo path="profile" />
                    </div>
                </div>

                <div className="good-content">
                    {/* 🔹 Блок изображения с галереей */}
                    <div className="good-image">
                        {displayImages.length > 0 ? (
                            <>
                                <div className="image-wrapper">
                                    <img 
                                        className="image"
                                        src={displayImages[currentImageIndex]?.url} 
                                        alt={good.title}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = 
                                                '<div class="image-placeholder">Image not available</div>';
                                        }}
                                    />
                                    
                                    {/* Стрелки навигации (только если изображений > 1) */}
                                    {displayImages.length > 1 && (
                                        <>
                                            <button className="gallery-nav prev" onClick={prevImage}>←</button>
                                            <button className="gallery-nav next" onClick={nextImage}>→</button>
                                        </>
                                    )}
                                </div>
                                
                                {/* Миниатюры (только если изображений > 1) */}
                                {displayImages.length > 1 && (
                                    <div className="gallery-thumbs">
                                        {displayImages.map((img, index) => (
                                            <button
                                                key={index}
                                                className={`thumb ${index === currentImageIndex ? 'active' : ''}`}
                                                onClick={() => setCurrentImageIndex(index)}
                                                type="button"
                                            >
                                                <img src={img.url} alt={`Thumb ${index + 1}`} />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="image-placeholder">Image not available</div>
                        )}
                    </div>

                    <div className="good-info">
                        <h2 className="good-title">{good.title}</h2>
                        
                        {categories.length > 0 && (
                            <div className="good-categories">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        className="category-chip"
                                        onClick={() => handleCategoryClick(cat.id)}
                                        title={`Show all in ${cat.name}`}
                                        type="button"
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        )}
                        
                        <p className="good-description">
                            {`Description: ${good.description || 'No description'}`}
                        </p>
                        
                        <p className="good-description">
                            {`Rating: ${calculateAverageRating(reviews)}`}
                        </p>
                        
                        <div className="good-price">
                            <span className="price-value">{`Price: ${good.price} ₽`}</span>
                        </div>
                        
                        {isUser && (
                            <div className="controls">
                                {good.isInBasket ? (
                                    <NavigateTo path="basket" />
                                ) : (
                                    <button className="btn-add-to-basket" onClick={handleAddToBasket}>
                                        add to basket
                                    </button>
                                )}
                                <button
                                    className="saveBtn"
                                    onClick={isSave ? handleRemoveSaveGood : handleAddSaveGood}
                                >
                                    <img
                                        src={isSave ? BookMarkActive : BookMarkUnActive}
                                        alt={isSave ? 'Delete from saved' : 'Save'}
                                    />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <aside className="reviews">
                    <h2>Product reviews</h2>
                    <div className="reviews-container">
                        {reviews.length > 0 ? (
                            reviews.map(renderReview)
                        ) : (
                            <p>There are no reviews for this product yet</p>
                        )}
                    </div>
                    
                    {!hasReviewed && (
                        <div className="added-review">
                            <h2>Add your review!</h2>
                            <textarea 
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder='Your review'
                                rows="4"
                            />
                            <div className="controls">
                                <input 
                                    type="text" 
                                    value={reviewImage}
                                    onChange={(e) => setReviewImage(e.target.value)}
                                    placeholder='Image link (optional)' 
                                />
                                <input 
                                    className="rating-input" 
                                    type="number" 
                                    value={reviewRating}
                                    onChange={(e) => setReviewRating(e.target.value)}
                                    placeholder='Rating (1-5)' 
                                    min="1" 
                                    max="5"
                                />
                                <button 
                                    className="submit" 
                                    onClick={handleAddReview}
                                >
                                    Add review
                                </button>
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </section>
    );
}