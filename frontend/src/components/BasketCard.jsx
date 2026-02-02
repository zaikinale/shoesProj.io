import { deleteGood, changeQuantityGoods } from "../api/basket"

/* eslint-disable react/prop-types */
export default function BasketCard ({id, title, desc, price, image, type, quantity}) {
    const handleChangeQuantityGood = async (type) => {
        let quantityNew = quantity
        if (type === "add") {
            quantityNew  += 1
        } else if (type === "deduct") {
            quantityNew -= 1
        }

        try {
            const resp = await changeQuantityGoods(id, quantityNew);
            console.log('Product change quantity in basket: ', resp);
        } catch (error) {
            console.error('Product deletion quantity in basket error: ', error);
        }
    }
    
    const handleDelete = async () => {
        try {
            const resp = await deleteGood(id);
            console.log('Product removed in basket: ', resp);
        } catch (error) {
            console.error('Product deletion in basket error: ', error);
        }
    }


    const controlBlock = () => {
        return (
            <div className="controlItem">
                <input type="checkbox" className="check" />
                <div className="controls">
                    <button className="low" onClick={() => handleChangeQuantityGood('deduct')}>-</button>
                    <button className="add" onClick={() => handleChangeQuantityGood('add')}>+</button>
                    <button className="delete" onClick={handleDelete}>×</button>
                </div>
            </div>
        )
    }

    return (
            <div className="basketItem">
                {controlBlock()}
                <img className="basketImg" src={image} alt={title} />
                <div className="basketInfo">
                    <h3 className="title">{title}</h3>
                    <span>{`Количество: ${quantity}`}</span>
                    <span className="price">{`Общая цена: ${price * quantity} ₽`}</span>
                </div>
            </div>
    )
}