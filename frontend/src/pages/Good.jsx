import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGoodById } from '../api/goods';
import NavigateTo from '../utils/navBtn.jsx';
import { addGood } from '../api/basket.js';
import BookMarkActive from '../assets/bookmark_active.svg'
import BookMarkUnActive from '../assets/bookmark_unactive.svg'

export default function Good() {
    const [good, setGood] = useState(null);
    const [isSave, setIsSave] = useState(false);
    const { id } = useParams();

    const fetchGood = async () => {
        const goodData = await getGoodById(Number(id));
        setGood(goodData);
    };

    useEffect(() => {
        if (id) {
            fetchGood();
        }
    }, [id]);

    if (!good) return null;

    const handleAddToBasket = async () => {
        try {
            await addGood(Number(id))
            console.log('Added to basket');
            setGood(prev => ({
                ...prev,
                isInBasket: true
            }));
        } catch (error) {
            console.error('Add to basket error:', error);
        }
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
                    <div className="good-image">
                        {good.image ? (
                            <img 
                                className='image'
                                src={good.image} 
                                alt={good.title}
                            />
                        ) : (
                            <div className="image-placeholder">
                                Изображение недоступно
                            </div>
                        )}
                    </div>

                    <div className="good-info">
                        <h2 className="good-title">{good.title}</h2>
                        <p className="good-description">{good.description || 'Описание отсутствует'}</p>
                        <div className="good-price">
                            <span className="price-value">{good.price} ₽</span>
                        </div>
                        
                        <div className="controls">
                            {good.isInBasket ? (
                                    <NavigateTo path="basket" />
                                ) : (
                                    <button className="btn-add-to-basket" onClick={handleAddToBasket}>
                                        add to basket
                                    </button>
                                )}
                            <button className="saveBtn" onClick={() => setIsSave(!isSave)}>
                                <img src={isSave ? BookMarkActive : BookMarkUnActive } alt="" />
                            </button>
                        </div>
                    </div>
                </div>

                <aside className="reviews">
                    <h2>Product reviews</h2>
                    <div className="reviews-container">
                        <div className="review-card">
                            <img src="https://iili.io/fpjt6kg.jpg" alt="review-user" />
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sed iusto a consectetur repellendus expedita repudiandae hic omnis doloribus dolor et alias rerum, recusandae vero saepe natus, temporibus consequuntur voluptate provident voluptatum impedit voluptates minus voluptas laborum? Temporibus unde maxime minus reiciendis molestias impedit architecto earum maiores optio error, similique dolorem cum harum asperiores vel dignissimos pariatur quisquam ducimus non aliquam fugiat alias. Debitis beatae facere necessitatibus modi cum id ducimus quidem voluptatum provident, sapiente voluptatem incidunt quod nobis quaerat a, eveniet nihil. Eius, fuga iste fugit error voluptatem architecto at, quia vero suscipit ab harum sapiente in consequuntur iure delectus.</p>
                            <div className="rating">5</div>
                        </div>
                        <div className="review-card">
                            <img src="https://iili.io/fpjt6kg.jpg" alt="review-user" />
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sed iusto a consectetur repellendus expedita repudiandae hic omnis doloribus dolor et alias rerum, recusandae vero saepe natus, temporibus consequuntur voluptate provident voluptatum impedit voluptates minus voluptas laborum? Temporibus unde maxime minus reiciendis molestias impedit architecto earum maiores optio error, similique dolorem cum harum asperiores vel dignissimos pariatur quisquam ducimus non aliquam fugiat alias. Debitis beatae facere necessitatibus modi cum id ducimus quidem voluptatum provident, sapiente voluptatem incidunt quod nobis quaerat a, eveniet nihil. Eius, fuga iste fugit error voluptatem architecto at, quia vero suscipit ab harum sapiente in consequuntur iure delectus.</p>
                            <div className="rating">5</div>
                        </div>
                        <div className="review-card">
                            <img src="https://iili.io/fpjt6kg.jpg" alt="review-user" />
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sed iusto a consectetur repellendus expedita repudiandae hic omnis doloribus dolor et alias rerum, recusandae vero saepe natus, temporibus consequuntur voluptate provident voluptatum impedit voluptates minus voluptas laborum? Temporibus unde maxime minus reiciendis molestias impedit architecto earum maiores optio error, similique dolorem cum harum asperiores vel dignissimos pariatur quisquam ducimus non aliquam fugiat alias. Debitis beatae facere necessitatibus modi cum id ducimus quidem voluptatum provident, sapiente voluptatem incidunt quod nobis quaerat a, eveniet nihil. Eius, fuga iste fugit error voluptatem architecto at, quia vero suscipit ab harum sapiente in consequuntur iure delectus.</p>
                            <div className="rating">5</div>
                        </div>
                    </div>
                    <div className="added-review">
                        <h2>Add your review!</h2>
                        <textarea name="" id="" placeholder='Your review'></textarea>
                        <div className="controls">
                            <input type="text" placeholder='image link' />
                            <input className='rating-input' type="text" placeholder='your rating (from 0 to 5)' />
                            <button className="submit">added your review</button>
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    );
}