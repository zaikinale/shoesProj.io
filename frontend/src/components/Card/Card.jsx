import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { updateGood } from '../../api/goods.js';
import { addGood as addToBasket, deleteGood as deleteFromBasket } from '../../api/basket.js';
import { checkIfSaved, removeSavedGood, saveGood } from '../../api/saves.js';

import styles from './Card.module.css';

import BookMarkActive from '../../assets/bookmark_active.svg';
import BookMarkUnActive from '../../assets/bookmark_unactive.svg';

export default function Card(props) {
    const {
        id,
        title,
        desc,
        description,
        price,
        image,
        images,
        type,
        isInBasket,
        refreshGoods,
        basketItemId,
        isActive: initialActive,
    } = props;

    const displayDesc = desc || description || '';

    const [inBasket, setInBasket] = useState(isInBasket);
    const [isSave, setIsSave] = useState(false);
    const [isActive, setIsActive] = useState(initialActive ?? true);
    const [isToggling, setIsToggling] = useState(false);

    const displayImage =
        images?.find((img) => img.isMain)?.url || images?.[0]?.url || image || null;

    const loadGoods = useCallback(async () => {
        try {
            const resp = await checkIfSaved(id);
            setIsSave(resp);
        } catch (error) {
            console.error('Error loading is save status good: ', error);
        }
    }, [id]);

    useEffect(() => {
        if (type === 'user') loadGoods();
    }, [type, loadGoods]);

    const handleToggleActive = async (e) => {
        e.preventDefault();
        if (isToggling) return;
        setIsToggling(true);
        const newStatus = !isActive;
        setIsActive(newStatus);
        try {
            await updateGood(id, { isActive: newStatus });
        } catch (error) {
            console.error('Failed to toggle active status:', error);
            setIsActive(!newStatus);
        } finally {
            setIsToggling(false);
        }
    };

    const handleToggleSave = async (e) => {
        e.preventDefault();
        try {
            if (isSave) {
                await removeSavedGood(id);
            } else {
                await saveGood(id);
            }
            loadGoods();
        } catch (error) {
            console.error('Error toggling save: ', error);
        }
    };

    const handleBasketAction = async (e) => {
        e.preventDefault();
        try {
            if (inBasket) {
                await deleteFromBasket(basketItemId);
                setInBasket(false);
            } else {
                await addToBasket(id);
                setInBasket(true);
            }
            refreshGoods();
        } catch (error) {
            console.error('Basket action error:', error);
        }
    };

    return (
        <article
            className={`${styles.productCard} ${!isActive ? styles['productCard--inactive'] : ''}`}
        >
            {type === 'user' && (
                <button className={styles.productCard__save} onClick={handleToggleSave}>
                    <img src={isSave ? BookMarkActive : BookMarkUnActive} alt="Save" />
                </button>
            )}

            <Link to={`/good/${id}`} className={styles.productCard__link}>
                <div className={styles.productCard__imageWrapper}>
                    <img
                        src={displayImage}
                        alt={title}
                        className={styles.productCard__img}
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300?text=No+Image';
                        }}
                    />
                </div>
                <div className={styles.productCard__info}>
                    <h3 className={styles.productCard__title}>{title}</h3>
                    <p className={styles.productCard__desc}>
                        {displayDesc || 'Описание скоро появится...'}
                    </p>
                    <span className={styles.productCard__price}>{price} ₽</span>
                </div>
            </Link>

            <div className={styles.productCard__actions}>
                {(type === 'user' || type === 'manager') && (
                    <button
                        className={`${styles.productCard__btn} ${inBasket ? styles['productCard__btn--remove'] : ''}`}
                        onClick={handleBasketAction}
                    >
                        {inBasket ? 'Удалить из корзины' : 'В корзину'}
                    </button>
                )}

                {type === 'admin' && (
                    <div className={styles.productCard__adminControls}>
                        <Link
                            to={`/admin/products/edit/${id}`}
                            className={styles.productCard__btnEdit}
                        >
                            Изменить
                        </Link>

                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={handleToggleActive}
                                disabled={isToggling}
                            />
                            <span className={styles.switch__slider}></span>
                        </label>
                    </div>
                )}
            </div>
        </article>
    );
}
