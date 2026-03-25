// import { useState, useEffect } from "react"
// import { Link } from "react-router";
// import { deleteGood, updateGood } from '../api/goods.js'
// import { addGood as addToBasket, deleteGood as deleteFromBasket } from "../api/basket.js";
// import { checkIfSaved, removeSavedGood, saveGood } from '../api/saves.js'
// import BookMarkActive from '../assets/bookmark_active.svg'
// import BookMarkUnActive from '../assets/bookmark_unactive.svg'

// // eslint-disable-next-line react/prop-types
// export default function Card ({
//     id, 
//     title, 
//     desc, 
//     price, 
//     image, 
//     images,
//     type, 
//     isInBasket, 
//     refreshGoods, 
//     basketItemId,
//     isActive: initialActive
// }) {
//     const [inBasket, setInBasket] = useState(isInBasket);
//     const [isChange, setIsChange] = useState(false);
//     const [isSave, setIsSave] = useState(false);
//     const [isActive, setIsActive] = useState(initialActive ?? true);  
//     const [isToggling, setIsToggling] = useState(false);
    
//     const [form, setForm] = useState({
//         title: title,
//         description: desc,
//         price: price,
//         image: image
//     })

//     const displayImage = images?.find(img => img.isMain)?.url || 
//                          images?.[0]?.url || 
//                          image || 
//                          null;

//     const loadGoods = async () => {
//         try {
//             const resp = await checkIfSaved(id);
//             setIsSave(resp)
//         } catch (error) {
//             console.error('Error loading is save status good: ', error);
//         }
//     };
    
//     useEffect(() => {
//         loadGoods();
//     }, []);

//     const handleToggleActive = async () => {
//         if (isToggling) return;
        
//         setIsToggling(true);
//         const newStatus = !isActive;
        
//         setIsActive(newStatus);

//         try {
//             await updateGood(id, { isActive: newStatus });
//         } catch (error) {
//             console.error('Failed to toggle active status:', error);
//             setIsActive(!newStatus);
//             alert('Failed to update status. Please try again.');
//         } finally {
//             setIsToggling(false);
//         }
//     };

//     const handleAddSaveGood = async() => {
//         try {
//             await saveGood(id);
//             loadGoods()
//         } catch (error) {
//             console.error('Error fetch add good save: ', error);
//         }
//     }

//     const handleRemoveSaveGood = async() => {
//         try {
//             await removeSavedGood(id);
//             loadGoods()
//         } catch (error) {
//             console.error('Error fetch delete good save: ', error);
//         }
//     }

//     const handleChange = () => {
//         setIsChange(!isChange);
//     }

//     const handleСancellation = () => {
//         setForm({
//             title: title,
//             description: desc,
//             price: price,
//             image: image
//         })
//         handleChange()
//         refreshGoods()
//     }

//     const handleDelete = async () => {
//         try {
//             const resp = await deleteGood(id);
//             console.log('Product removed: ', resp);
//             refreshGoods()
//         } catch (error) {
//             console.error('Product deletion error: ', error);
//         }
//     }

//     const handleSaveChanges = async () => {
//         const payload = {
//             title: form.title || '',
//             description: form.description || '',
//             price: Number(form.price),
//             image: form.image || null
//         };
        
//         if (isNaN(payload.price)) {
//             alert('The price must be a number');
//             return;
//         }

//         try {
//             const resp = await updateGood(id, payload);
//             console.log('Product changed:', resp);
//             handleChange()
//             refreshGoods()
//         } catch (error) {
//             console.error('Product change error: ', error);
//         }
//     }

//     const handleAddToBasket = async () => {
//         try {
//             await addToBasket(id);
//             setInBasket(true);
//             console.log('Added to basket');
//             refreshGoods()
//         } catch (error) {
//             console.error('Add to basket error:', error);
//         }
//     };

//     const handleRemoveFromBasket = async () => {
//         try {
//             await deleteFromBasket(basketItemId);
//             setInBasket(false);
//             console.log('Removed from basket');
//             refreshGoods()
//         } catch (error) {
//             console.error('Remove from basket error:', error);
//         }
//     };

//     const changeInputForm = (field, value) => {
//         setForm(prev => ({
//             ...prev,
//             [field]: value
//         }));
//     };

//     // 🔹 Компонент изображения с обработкой ошибки
//     const ProductImage = () => (
//         <div className="image-wrapper">
//             <img 
//                 className="img" 
//                 src={displayImage} 
//                 alt={title}
//                 onError={(e) => {
//                     e.target.style.display = 'none';
//                     e.target.parentElement.innerHTML = 
//                         '<div class="image-placeholder">Image not available</div>';
//                 }}
//             />
//         </div>
//     );

//     if (type === "user") {
//         return (
//             <div className={`card ${!isActive ? 'inactive' : ''}`}>
//                 <button className="saveBtn saveBtnPos" onClick={isSave ? handleRemoveSaveGood : handleAddSaveGood }>
//                     <img src={isSave ? BookMarkActive : BookMarkUnActive } alt={isSave ? 'Delete' : 'Save' }  />
//                 </button>
//                 <Link to={`/good/${id}`}>
//                     <>
//                         <ProductImage />
//                         <div className="containerCard">
//                             <h3 className="title">{title}</h3>
//                             <p className="desc">{desc}</p>
//                             <span className="price">{`${price} ₽`}</span>
//                         </div>
//                     </>
//                 </Link>
//                 {inBasket ? (
//                     <button 
//                         className="remove-basket" 
//                         onClick={handleRemoveFromBasket}
//                     >
//                         Delete from basket
//                     </button>
//                 ) : (
//                     <button 
//                         className="add-basket" 
//                         onClick={handleAddToBasket}
//                     >
//                         Add in basket
//                     </button>
//                 )}
//             </div>
//         )
//     } else if (type === "manager") {
//         return (
//             <div className={`card ${!isActive ? 'inactive' : ''}`}>
//                 <Link to={`/good/${id}`}>
//                     <>
//                         <ProductImage />
//                         <div className="containerCard">
//                             <h3 className="title">{title}</h3>
//                             <p className="desc">{desc}</p>
//                             <span className="price">{`${price} ₽`}</span>
//                         </div>
//                     </>
//                 </Link>
//                 {inBasket ? (
//                     <button 
//                         className="remove-basket" 
//                         onClick={handleRemoveFromBasket}
//                     >
//                         Delete from basket
//                     </button>
//                 ) : (
//                     <button 
//                         className="add-basket" 
//                         onClick={handleAddToBasket}
//                     >
//                         Add in basket
//                     </button>
//                 )}
//             </div>
//         )
//     } else if (type === "admin") {
//         return (
//             <div className={`card ${!isActive ? 'inactive' : ''}`}>
                
//                 { isChange ? ( 
//                     <>
//                         <input type="text" value={form.title || ''} placeholder="title" onChange={(e) => changeInputForm('title', e.target.value)}/>
//                         <input type="text" value={form.description || ''} placeholder="description" onChange={(e) => changeInputForm('description', e.target.value)}/>
//                         <input type="text" value={form.price || ''} placeholder="price" onChange={(e) => changeInputForm('price', e.target.value)}/>
//                         <input type="text" value={form.image || ''} placeholder="image link" onChange={(e) => changeInputForm('image', e.target.value)}/>
//                         <button className="submitForm" onClick={handleSaveChanges}>submit changes</button>
//                     </>
//                 ) : (
//                     <>
//                         <Link to={`/good/${id}`}>
//                             <>
//                                 <ProductImage />
//                                 <div className="containerCard">
//                                     <h3 className="title">{title}</h3>
//                                     <p className="desc">{desc}</p>
//                                     <span className="price">{`${price} ₽`}</span>
//                                 </div>
//                             </>
//                         </Link>
//                     </>
//                 )}

//                 <div className="controls">
//                     <Link 
//                             to={`/admin/products/edit/${id}`} 
//                             className="btn"
//                             onClick={(e) => e.stopPropagation()}
//                         >
//                             Edit
//                     </Link>
//                     <div className="admin-toggle-wrapper">
//                     <label className={`toggle ${isActive ? 'active' : ''} ${isToggling ? 'loading' : ''}`}>
//                         <input
//                             type="checkbox"
//                             checked={isActive}
//                             onChange={handleToggleActive}
//                             disabled={isToggling}
//                             className="toggle-input"
//                         />
//                         <span className="toggle-track">
//                             <span className="toggle-thumb" />
//                         </span>
//                     </label>
//                 </div>
//                 </div>
//             </div>
//         )   
//     } else {
//         return (
//             <div className={`card ${!isActive ? 'inactive' : ''}`}>
//                 <Link to={`/good/${id}`}>
//                     <>
//                         <ProductImage />
//                         <div className="containerCard">
//                             <h3 className="title">{title}</h3>
//                             <p className="desc">{desc}</p>
//                             <span className="price">{`${price} ₽`}</span>
//                         </div>
//                     </>
//                 </Link>
//             </div>
//         )
//     }
// }
import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Убедись, что импорт из react-router-dom
import { updateGood } from '../../api/goods.js'; // Удалили deleteGood
import { addGood as addToBasket, deleteGood as deleteFromBasket } from "../../api/basket.js";
import { checkIfSaved, removeSavedGood, saveGood } from '../../api/saves.js';

import styles from './Card.module.css';

// Иконки
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
        isActive: initialActive 
    } = props;

    const displayDesc = desc || description || "";

    const [inBasket, setInBasket] = useState(isInBasket);
    const [isSave, setIsSave] = useState(false);
    const [isActive, setIsActive] = useState(initialActive ?? true);
    const [isToggling, setIsToggling] = useState(false);
    
    // Состояние isChange нам больше не нужно, так как мы переходим на другую страницу для правки
    const displayImage = images?.find(img => img.isMain)?.url || images?.[0]?.url || image || null;

    const loadGoods = async () => {
        try {
            const resp = await checkIfSaved(id);
            setIsSave(resp);
        } catch (error) {
            console.error('Error loading is save status good: ', error);
        }
    };

    useEffect(() => {
        if (type === 'user') loadGoods();
    }, [id]);

    const handleToggleActive = async (e) => {
        e.preventDefault(); // Чтобы клик по переключателю не дергал ссылку
        if (isToggling) return;
        setIsToggling(true);
        const newStatus = !isActive;
        setIsActive(newStatus);
        try {
            await updateGood(id, { isActive: newStatus });
        } catch (error) {
            console.error('Failed to toggle active status:', error);
            setIsActive(!newStatus);
        } finally { setIsToggling(false); }
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
        <article className={`${styles.productCard} ${!isActive ? styles['productCard--inactive'] : ''}`}>
            
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
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=No+Image'; }}
                    />
                </div>
                <div className={styles.productCard__info}>
                    <h3 className={styles.productCard__title}>{title}</h3>
                    <p className={styles.productCard__desc}>
                        {displayDesc || "Описание скоро появится..."}
                    </p>
                    <span className={styles.productCard__price}>{price} ₽</span>
                </div>
            </Link>

            <div className={styles.productCard__actions}>
                {(type === "user" || type === "manager") && (
                    <button 
                        className={`${styles.productCard__btn} ${inBasket ? styles['productCard__btn--remove'] : ''}`}
                        onClick={handleBasketAction}
                    >
                        {inBasket ? 'Удалить из корзины' : 'В корзину'}
                    </button>
                )}

                {type === "admin" && (
    <div className={styles.productCard__adminControls}>
        {/* Путь должен быть таким же, как в Route path="..." */}
        <Link to={`/admin/products/edit/${id}`} className={styles.productCard__btnEdit}>
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