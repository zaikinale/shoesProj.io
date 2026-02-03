import { getBasket, deleteBasket } from '../api/basket.js';
import { useEffect, useState } from 'react';
import BasketCard from '../components/BasketCard.jsx'
import NavigateTo from '../utils/navBtn.jsx'

export default function Basket () {
    const [goods, setGoods] = useState([]);

    const loadGoods = async () => {
        try {
            const data = await getBasket();
            console.log(data)
            setGoods(data.items);
        } catch (error) {
            console.error('Error loading goods: ', error);
        }
    };

    useEffect(() => {
        loadGoods();
    }, []);

    const handleClearBasket = async () => {
        try {
            const resp = await deleteBasket();
            console.log('Success on delete basket',resp)
            loadGoods();
        } catch (error) {
            console.error('Error delete basket: ', error);
        }
    }


    const orderBlock = () => {
        const totalPrise = 10000;
        const totalCount = 5;
        return (
            <div className="sectionOrder">
                <p className="totalCount">{`Общее количество товаров: ${totalCount}`}</p>
                <p className="totalSum">{`Общая сумма: ${totalPrise}`}</p>
                <NavigateTo path={'orders'}/>
            </div>
        )
    }

    const renderBasketBody = (type) => {
        if (type === "user") {
            return (
                <div className="containerColumn">
                    <button className="clear" onClick={handleClearBasket}>Clear basket</button>
                    {goods.length > 0 ? (
                        <>
                            {goods.map((goodItem) => (
                                <BasketCard
                                    key={goodItem.id}
                                    id={goodItem.id}
                                    title={goodItem.good.title}
                                    desc={goodItem.good.description}
                                    price={goodItem.good.price}
                                    image={goodItem.good.image}
                                    type={type}
                                    quantity={goodItem.quantity}
                                />
                            ))}
                            {orderBlock()}
                        </>
                    ) : (
                        <p>No products in basket</p>        
                    )}
                </div>
            )
        }
        return null;
    }

    return (
        <section className="basket">
            <h1 className="head">
                < NavigateTo path="basket"/>
                <div className="controllers">
                    < NavigateTo path="store"/>
                    < NavigateTo path="orders"/>
                    < NavigateTo path="logout"/>
                </div>
            </h1>
            {renderBasketBody('user')}
        </section>
    )
}