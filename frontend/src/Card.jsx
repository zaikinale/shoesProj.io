
export default function Card ({id, title, desc, price, image, type}) {

    if (type ==="user") {
        return (
            <div className="card">
                <img className="img" src={image} alt={title} />
                <h3 className="title">{title}</h3>
                <p className="desc">{desc}</p>
                <span className="price">{`${price} ₽`}</span>
                <button className="add">Добавить товар</button>
            </div>
        )
    } else if (type ==="manager") {
        return (
            <div className="card">
                <img className="img" src={image} alt={title} />
                <h3 className="title">{title}</h3>
                <p className="desc">{desc}</p>
                <span className="price">{`${price} ₽`}</span>
                <button className="add">Добавить товар</button>
            </div>
        )
    } else if (type ==="admin") {
        return (
            <div className="card">
                <img className="img" src={image} alt={title} />
                <h3 className="title">{title}</h3>
                <p className="desc">{desc}</p>
                <span className="price">{`${price} ₽`}</span>
                <button className="add">Добавить товар</button>
                <button className="change">Изменить товар</button>
                <button className="add">Удалить товар</button>
            </div>
        )   
    } else {
        return (
            <div className="card">
                <img className="img" src={image} alt={title} />
                <h3 className="title">{title}</h3>
                <p className="desc">{desc}</p>
                <span className="price">{`${price} ₽`}</span>
            </div>
        )
    }
    
}