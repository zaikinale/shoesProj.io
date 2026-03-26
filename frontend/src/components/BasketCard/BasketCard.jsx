import { deleteGood, changeQuantityGoods } from "../../api/basket";
import styles from './BasketCard.module.css';

export default function BasketCard({ id, title, desc, description, price, image, quantity, refreshGoods }) {
    
    const displayDesc = desc || description || "";

    const handleChangeQuantity = async (action) => {
        let newQuantity = quantity;
        
        if (action === "add") {
            newQuantity += 1;
        } else if (action === "deduct") {
            if (quantity <= 1) return;
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
            {/* <div className={styles.basketItem__selection}>
                <input type="checkbox" className={styles.basketItem__checkbox} />
            </div> */}

            <div className={styles.basketItem__imageWrapper}>
                <img src={image} alt={title} className={styles.basketItem__img} />
            </div>

            <div className={styles.basketItem__info}>
                <h3 className={styles.basketItem__title}>{title}</h3>
                <p className={styles.basketItem__desc}>{displayDesc}</p>
            </div>

            <div className={styles.basketItem__controls}>
            

            <div className={styles.basketItem__priceBlock}>
                <span className={styles.basketItem__price}>{price * quantity} ₽</span>
                <span className={styles.basketItem__unitPrice}>{price} ₽ / шт.</span>
            </div>

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
            <button className={styles.basketItem__delete} onClick={handleDelete} title="Удалить">
                ×
            </button>
            </div>
            </div>

           
        </div>
    );
}