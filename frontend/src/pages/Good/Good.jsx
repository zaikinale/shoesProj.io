import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGood } from '../../hooks/useGood.js';
import { useReviews } from '../../hooks/useReviews.js';
import BookMarkActive from '../../assets/bookmark_active.svg';
import BookMarkUnActive from '../../assets/bookmark_unactive.svg';
import styles from './Good.module.css';

export default function Good() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { good, categories, isSaved, loading, toggleSave, addToBasket } = useGood(id);
    const { reviews, hasReviewed, submitReview, avgRating } = useReviews(good?.id);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [form, setForm] = useState({ text: '', rating: '', image: '' });

    if (loading) return <div className={styles.loader}>Загрузка...</div>;
    if (!good) return <div className={styles.error}>Товар не найден</div>;

    const allImages = [
        ...(good.image ? [{ url: good.image }] : []),
        ...(good.images || [])
    ];

    const handleAddReview = async () => {
        const rating = Number(form.rating);
        if (!form.text.trim() || isNaN(rating) || rating < 1 || rating > 5) {
            alert('Заполните отзыв и поставьте оценку 1-5');
            return;
        }
        try {
            await submitReview(form.text.trim(), rating, form.image || null);
            setForm({ text: '', rating: '', image: '' });
        } catch (err) { alert(err.message); }
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <button className="btn" onClick={() => navigate('/store')}>Главная</button>
                    <nav className={styles.nav}>
                        <button className="btn" onClick={() => navigate('/basket')}>Корзина</button>
                        <button className="btn" onClick={() => navigate('/orders')}>Заказы</button>
                        <button className="btn" onClick={() => navigate('/profile')}>Профиль</button>
                    </nav>
                </div>
            </header>

            <main className={styles.container}>
                <section className={styles.mainGrid}>
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
                                <img key={idx} src={img.url} className={`${styles.thumb} ${idx === currentImageIndex ? styles.activeThumb : ''}`} onClick={() => setCurrentImageIndex(idx)} />
                            ))}
                        </div>
                    </div>

                    <div className={styles.info}>
                        <div className={styles.categoryList}>
                            {categories.map(cat => (
                                <span key={cat.id} className={styles.chip} onClick={() => navigate(`/categories/${cat.id}`)}>{cat.name}</span>
                            ))}
                        </div>
                        <h1 className={styles.title}>{good.title}</h1>
                        <div className={styles.ratingBadge}>★ {avgRating} <span>({reviews.length} отзывов)</span></div>
                        <p className={styles.description}>{good.description || 'Описание отсутствует'}</p>
                        <div className={styles.priceRow}>
                            <div className={styles.price}>{good.price} ₽</div>
                            <div className={styles.actions}>
                                {good.isInBasket ? <button className={styles.btnInBasket} onClick={() => navigate('/basket')}>В корзине</button> : <button className={styles.btnBuy} onClick={addToBasket}>В корзину</button>}
                                <button className={styles.btnSave} onClick={toggleSave}>
                                    <img src={isSaved ? BookMarkActive : BookMarkUnActive} alt="save" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.reviewsSection}>
                    <h2>Отзывы</h2>
                    {!hasReviewed && (
                        <div className={styles.reviewForm}>
                            <textarea placeholder="Ваш отзыв..." value={form.text} onChange={e => setForm({...form, text: e.target.value})} />
                            <div className={styles.formRow}>
                                <input type="number" placeholder="Оценка (1-5)" value={form.rating} onChange={e => setForm({...form, rating: e.target.value})} />
                                <button onClick={handleAddReview}>Отправить</button>
                            </div>
                        </div>
                    )}
                    <div className={styles.reviewsList}>
                        {reviews.map(r => (
                            <div key={r.id} className={styles.reviewCard}>
                                <strong>{r.user?.username || 'Аноним'} — {'★'.repeat(r.rating)}</strong>
                                <p>{r.text}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}