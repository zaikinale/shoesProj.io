

/* eslint-disable react/prop-types */
export default function BasketCard ({id, title, desc, price, image, type, quantity}) {
    const controlBlock = () => {
        return (
            <div className="controlItem">
                <input type="checkbox" className="check" />
                <div className="controls">
                    <button className="low">-</button>
                    <button className="add">+</button>
                    <button className="delete">×</button>
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