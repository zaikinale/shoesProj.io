/* eslint-disable react/prop-types */
export default function OrderList({ id, data, status, list }) {
    const renderListGood = (good) => {
        return (
            <div className="cardSmall" key={good.id}>
                <img src={good.image} alt={good.title} className="imgSmall" />
                <h3 className="title">{good.title}</h3>
            </div>
        )
    }

    return (
        <div className="order">
            <h2 className="title">{`Заказ от ${data}`}</h2>
            <span className="status">{status}</span>
            <div className="goodsList">
                {list.map((good) => renderListGood(good))}
            </div>
        </div>
    )
}