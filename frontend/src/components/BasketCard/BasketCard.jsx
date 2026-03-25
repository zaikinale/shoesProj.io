// import { deleteGood, changeQuantityGoods } from "../../api/basket"

// /* eslint-disable react/prop-types */
// export default function BasketCard ({id, title, desc, price, image, type, quantity, refreshGoods}) {
//     const handleChangeQuantityGood = async (type) => {
//         let quantityNew = quantity
//         if (type === "add") {
//             quantityNew  += 1
//         } else if (type === "deduct") {
//             quantityNew -= 1
//         }

//         try {
//             const resp = await changeQuantityGoods(id, quantityNew);
//             console.log('Product change quantity in basket: ', resp);
//         } catch (error) {
//             console.error('Product deletion quantity in basket error: ', error);
//         }
//         refreshGoods()
//     }
    
//     const handleDelete = async () => {
//         try {
//             const resp = await deleteGood(id);
//             console.log('Product removed in basket: ', resp);
//         } catch (error) {
//             console.error('Product deletion in basket error: ', error);
//         }
//         refreshGoods()
//     }


//     const controlBlock = () => {
//         return (
//             <div className="controlItem">
//                 <input type="checkbox" className="check" />
//                 <div className="controls">
//                     <button className="low" onClick={() => handleChangeQuantityGood('deduct')}>-</button>
//                     <button className="add" onClick={() => handleChangeQuantityGood('add')}>+</button>
//                     <button className="delete" onClick={handleDelete}>×</button>
//                 </div>
//             </div>
//         )
//     }

//     return (
//             <div className="basketItem">
//                 {controlBlock()}
//                 <img className="basketImg" src={image} alt={title} />
//                 <div className="basketInfo">
//                     <h3 className="title">{title}</h3>
//                     <span>{`Count: ${quantity}`}</span>
//                     <span className="price">{`Total price: ${price * quantity} ₽`}</span>
//                 </div>
//             </div>
//     )
// }

import { deleteGood, changeQuantityGoods } from "../../api/basket";
import styles from './BasketCard.module.css';

export default function BasketCard({ id, title, desc, description, price, image, quantity, refreshGoods }) {
    
    // Подхватываем описание, как и в прошлой карточке
    const displayDesc = desc || description || "";

    const handleChangeQuantity = async (action) => {
        let newQuantity = quantity;
        
        if (action === "add") {
            newQuantity += 1;
        } else if (action === "deduct") {
            if (quantity <= 1) return; // Не даем уйти в ноль или минус
            newQuantity -= 1;
        }

        try {
            await changeQuantityGoods(id, newQuantity);
            refreshGoods();
        } catch (error) {
            console.error('Error changing quantity:', error);
        }
    };
    
    const handleDelete = async () => {
        if (!window.confirm("Удалить товар из корзины?")) return;
        try {
            await deleteGood(id);
            refreshGoods();
        } catch (error) {
            console.error('Error deleting from basket:', error);
        }
    };

    return (
        <div className={styles.basketItem}>
            {/* Чекбокс и контроллы слева */}
            <div className={styles.basketItem__selection}>
                <input type="checkbox" className={styles.basketItem__checkbox} />
            </div>

            {/* Изображение */}
            <div className={styles.basketItem__imageWrapper}>
                <img src={image} alt={title} className={styles.basketItem__img} />
            </div>

            {/* Инфо (заголовок и описание) */}
            <div className={styles.basketItem__info}>
                <h3 className={styles.basketItem__title}>{title}</h3>
                <p className={styles.basketItem__desc}>{displayDesc}</p>
            </div>

            {/* Управление количеством */}
            <div className={styles.basketItem__counter}>
                <button 
                    className={styles.basketItem__countBtn} 
                    onClick={() => handleChangeQuantity('deduct')}
                    disabled={quantity <= 1}
                >–</button>
                <span className={styles.basketItem__quantity}>{quantity}</span>
                <button 
                    className={styles.basketItem__countBtn} 
                    onClick={() => handleChangeQuantity('add')}
                >+</button>
            </div>

            {/* Цена */}
            <div className={styles.basketItem__priceBlock}>
                <span className={styles.basketItem__price}>{price * quantity} ₽</span>
                <span className={styles.basketItem__unitPrice}>{price} ₽ / шт.</span>
            </div>

            {/* Удаление */}
            <button className={styles.basketItem__delete} onClick={handleDelete} title="Удалить">
                ×
            </button>
        </div>
    );
}