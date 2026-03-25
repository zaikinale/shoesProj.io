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

//     const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

//     const allImages = [
//         ...(good.images?.filter(img => img.url !== good.image) || []),
//         ...(good.image ? [{ url: good.image, isMain: true }] : [])
//     ];

//     const mainGalleryImage = allImages.find(img => img.isMain);
//     const otherImages = allImages.filter(img => !img.isMain);
//     const displayImages = mainGalleryImage ? [mainGalleryImage, ...otherImages] : allImages;

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

//     const prevImage = () => {
//         setCurrentImageIndex(i => i === 0 ? displayImages.length - 1 : i - 1);
//     };

//     const nextImage = () => {
//         setCurrentImageIndex(i => i === displayImages.length - 1 ? 0 : i + 1);
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
//                         {displayImages.length > 0 ? (
//                             <>
//                                 <div className="image-wrapper">
//                                     <img 
//                                         className="image"
//                                         src={displayImages[currentImageIndex]?.url} 
//                                         alt={good.title}
//                                         onError={(e) => {
//                                             e.target.style.display = 'none';
//                                             e.target.parentElement.innerHTML = 
//                                                 '<div class="image-placeholder">Image not available</div>';
//                                         }}
//                                     />
                                    
//                                     {displayImages.length > 1 && (
//                                         <>
//                                             <button className="gallery-nav prev" onClick={prevImage}>←</button>
//                                             <button className="gallery-nav next" onClick={nextImage}>→</button>
//                                         </>
//                                     )}
//                                 </div>
                                
//                                 {displayImages.length > 1 && (
//                                     <div className="gallery-thumbs">
//                                         {displayImages.map((img, index) => (
//                                             <button
//                                                 key={index}
//                                                 className={`thumb ${index === currentImageIndex ? 'active' : ''}`}
//                                                 onClick={() => setCurrentImageIndex(index)}
//                                                 type="button"
//                                             >
//                                                 <img src={img.url} alt={`Thumb ${index + 1}`} />
//                                             </button>
//                                         ))}
//                                     </div>
//                                 )}
//                             </>
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
//                                         type="button"
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
//                             {`Rating: ${calculateAverageRating(reviews)}`}
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
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGoodById } from '../../api/goods';
import { getCategoriesByGoodId } from '../../api/categories';
import NavigateTo from '../../utils/navBtn.jsx';
import { addGood } from '../../api/basket.js';
import { createReview, getReviewsByGoodId, checkIfReviewed } from '../../api/reviews.js';
import { checkIfSaved, removeSavedGood, saveGood } from '../../api/saves.js';
import BookMarkActive from '../../assets/bookmark_active.svg';
import BookMarkUnActive from '../../assets/bookmark_unactive.svg';
import styles from './Good.module.css';

export default function Good() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [good, setGood] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isSave, setIsSave] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [reviewImage, setReviewImage] = useState('');
    const [reviewRating, setReviewRating] = useState('');
    const [isUser, setIsUser] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const goodData = await getGoodById(Number(id));
                    setGood(goodData);
                    
                    const [cats, saveStatus, reviewsData, reviewStatus] = await Promise.all([
                        getCategoriesByGoodId(goodData.id),
                        checkIfSaved(goodData.id).catch(() => false),
                        getReviewsByGoodId(goodData.id),
                        checkIfReviewed(goodData.id).catch(() => true)
                    ]);

                    setCategories(cats);
                    setIsSave(saveStatus);
                    setReviews(reviewsData);
                    setHasReviewed(reviewStatus);
                    setIsUser(true);
                } catch (error) {
                    console.error('Error loading good details:', error);
                }
            };
            fetchData();
        }
    }, [id]);

    if (!good) return <div className={styles.loader}>Загрузка товара...</div>;

    const allImages = [
        ...(good.image ? [{ url: good.image, isMain: true }] : []),
        ...(good.images?.filter(img => img.url !== good.image) || [])
    ];

    const handleAddSaveGood = async () => {
        try {
            await saveGood(good.id);
            setIsSave(true);
        } catch (error) { console.error(error); }
    };

    const handleRemoveSaveGood = async () => {
        try {
            await removeSavedGood(good.id);
            setIsSave(false);
        } catch (error) { console.error(error); }
    };

    const handleAddToBasket = async () => {
        try {
            await addGood(Number(good.id));
            setGood(prev => ({ ...prev, isInBasket: true }));
        } catch (error) { console.error(error); }
    };

    const handleAddReview = async () => {
        const rating = Number(reviewRating);
        if (!reviewText.trim() || isNaN(rating) || rating < 1 || rating > 5) {
            alert('Заполните отзыв и поставьте оценку от 1 до 5');
            return;
        }
        try {
            await createReview(good.id, reviewText.trim(), rating, reviewImage || null);
            setHasReviewed(true);
            const updatedReviews = await getReviewsByGoodId(good.id);
            setReviews(updatedReviews);
        } catch (error) { alert(error.message); }
    };

    const avgRating = reviews.length > 0 
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : "—";

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <NavigateTo path="store" />
                    <nav className={styles.nav}>
                        <NavigateTo path="basket" />
                        <NavigateTo path="orders" />
                        <NavigateTo path="profile" />
                    </nav>
                </div>
            </header>

            <main className={styles.container}>
                <section className={styles.mainGrid}>
                    {/* ГАЛЕРЕЯ */}
                    <div className={styles.gallery}>
                        <div className={styles.mainImageWrapper}>
                            <img src={allImages[currentImageIndex]?.url} alt={good.title} className={styles.mainImage} />
                            {allImages.length > 1 && (
                                <div className={styles.arrows}>
                                    <button onClick={() => setCurrentImageIndex(i => i === 0 ? allImages.length - 1 : i - 1)}>←</button>
                                    <button onClick={() => setCurrentImageIndex(i => i === allImages.length - 1 ? 0 : i + 1)}>→</button>
                                </div>
                            )}
                        </div>
                        <div className={styles.thumbs}>
                            {allImages.map((img, idx) => (
                                <img 
                                    key={idx} 
                                    src={img.url} 
                                    className={`${styles.thumb} ${idx === currentImageIndex ? styles.activeThumb : ''}`}
                                    onClick={() => setCurrentImageIndex(idx)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* ИНФОРМАЦИЯ */}
                    <div className={styles.info}>
                        <div className={styles.categoryList}>
                            {categories.map(cat => (
                                <span key={cat.id} className={styles.chip} onClick={() => navigate(`/categories/${cat.id}`)}>
                                    {cat.name}
                                </span>
                            ))}
                        </div>
                        <h1 className={styles.title}>{good.title}</h1>
                        <div className={styles.ratingBadge}>★ {avgRating} <span>({reviews.length} отзывов)</span></div>
                        
                        <p className={styles.description}>{good.description || 'Описание отсутствует'}</p>
                        
                        <div className={styles.priceRow}>
                            <div className={styles.price}>{good.price} ₽</div>
                            {isUser && (
                                <div className={styles.actions}>
                                    {good.isInBasket ? (
                                        <button className={styles.btnInBasket} onClick={() => navigate('/basket')}>В корзине</button>
                                    ) : (
                                        <button className={styles.btnBuy} onClick={handleAddToBasket}>В корзину</button>
                                    )}
                                    <button className={styles.btnSave} onClick={isSave ? handleRemoveSaveGood : handleAddSaveGood}>
                                        <img src={isSave ? BookMarkActive : BookMarkUnActive} alt="save" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* ОТЗЫВЫ */}
                <section className={styles.reviewsSection}>
                    <div className={styles.reviewsHeader}>
                        <h2>Отзывы покупателей</h2>
                        {!hasReviewed && <button className={styles.btnOpenReview}>Оставить отзыв</button>}
                    </div>

                    {!hasReviewed && (
                        <div className={styles.reviewForm}>
                            <textarea placeholder="Ваш опыт использования..." value={reviewText} onChange={e => setReviewText(e.target.value)} />
                            <div className={styles.formRow}>
                                <input type="text" placeholder="Ссылка на фото (опционально)" value={reviewImage} onChange={e => setReviewImage(e.target.value)} />
                                <input type="number" placeholder="Оценка (1-5)" min="1" max="5" value={reviewRating} onChange={e => setReviewRating(e.target.value)} />
                                <button onClick={handleAddReview}>Отправить</button>
                            </div>
                        </div>
                    )}

                    <div className={styles.reviewsList}>
                        {reviews.length > 0 ? reviews.map(r => (
                            <div key={r.id} className={styles.reviewCard}>
                                <div className={styles.revUser}>
                                    <div className={styles.revAvatar}>{r.user?.username?.charAt(0) || 'U'}</div>
                                    <div>
                                        <div className={styles.revName}>{r.user?.username || 'User'}</div>
                                        <div className={styles.revStars}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                                    </div>
                                </div>
                                <p className={styles.revText}>{r.text}</p>
                                {r.image && <img src={r.image} className={styles.revImg} alt="Review" />}
                            </div>
                        )) : <p className={styles.empty}>Отзывов пока нет. Будьте первым!</p>}
                    </div>
                </section>
            </main>
        </div>
    );
}