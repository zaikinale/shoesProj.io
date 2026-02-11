import { getBasket, deleteBasket } from '../api/basket.js';
import { createOrder } from '../api/orders.js'
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

    const refreshGoods = () => loadGoods();

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

    const handleCreateOrder = async () => {
        try {
            const resp = await createOrder();
            console.log('Success on create order',resp)
            loadGoods();
        } catch (error) {
            console.error('Error create order: ', error);
        }
    }


    const orderBlock = () => {
        const totalCount = goods.reduce((sum, item) => sum + item.quantity, 0);
        
        const totalPrice = goods.reduce((sum, item) => sum + (item.good.price * item.quantity), 0);
        
        return (
            <div className="sectionOrder">
                <p className="totalCount">{`Общее количество товаров: ${totalCount}`}</p>
                <p className="totalSum">{`Общая сумма: ${totalPrice} ₽`}</p>
                <button className="create" onClick={handleCreateOrder}>create order</button>
            </div>
        )
    }

    const renderBasketBody = (type) => {
        if (type === "user") {
            return (
                <div className="containerColumn">
                    {goods.length > 0 && <button className="clear" onClick={handleClearBasket}>Clear basket</button>}
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
                                    refreshGoods={refreshGoods}
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
            <div className="head">
                < NavigateTo path="basket"/>
                <div className="controllers">
                    < NavigateTo path="store"/>
                    < NavigateTo path="orders"/>
                    < NavigateTo path="profile"/>
                </div>
            </div>
            {renderBasketBody('user')}
        </section>
    )
}