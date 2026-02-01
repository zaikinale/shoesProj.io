export default function BasketCard ({id, title, desc, price, image, type, quantity}) {
    return (
            <div className="basketItem">
                <img className="basketImg" src={image} alt={title} />
                <div className="basketInfo">
                    <h3 className="title">{title}</h3>
                    <span>{`Количество: ${quantity}`}</span>
                    <span className="price">{`Общая цена: ${price*quantity} ₽`}</span>
                </div>
            </div>
    )
}