import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGoodById } from '../api/goods';
import NavigateTo from '../utils/navBtn.jsx';
import { addGood } from '../api/basket.js';

export default function Good() {
    const [good, setGood] = useState(null);
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
                <h1 className="head">
                    <NavigateTo path="store" />
                    <div className="controllers">
                        <NavigateTo path="basket" />
                        <NavigateTo path="orders" />
                        <NavigateTo path="logout" />
                    </div>
                </h1>

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
                        
                        {good.isInBasket ? (
                            <NavigateTo path="basket" />
                        ) : (
                            <button className="btn-add-to-basket" onClick={handleAddToBasket}>
                                add to basket
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}