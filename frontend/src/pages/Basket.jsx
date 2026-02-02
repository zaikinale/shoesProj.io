import { getBasket } from '../api/basket.js';
import { useEffect, useState } from 'react';
import BasketCard from '../components/BasketCard.jsx'
import NavigateTo from '../utils/navBtn.jsx'
// const testData = [
//     {
//         id: 1,
//         image: "https://i.ibb.co/qLhFKfGv/watch-10-46-rose-gold-light-blush-band-1-1000x1000.jpg",
//         title: 'test',
//         description: 'desc test good',
//         price: 3000,
//         quantity: 5,
//     },
//     {
//         id: 2,
//         image: "https://i.ibb.co/qLhFKfGv/watch-10-46-rose-gold-light-blush-band-1-1000x1000.jpg",
//         title: 'test1',
//         description: 'desc test good2',
//         price: 100,
//         quantity: 3,
//     },
//     {
//         id: 3,
//         image: "https://i.ibb.co/qLhFKfGv/watch-10-46-rose-gold-light-blush-band-1-1000x1000.jpg",
//         title: 'test21',
//         description: 'desc te213st good2',
//         price: 56600,
//         quantity: 10,
//     },
// ]

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