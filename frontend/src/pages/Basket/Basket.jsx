// import { getBasket, deleteBasket } from '../api/basket.js';
// import { createOrder } from '../api/orders.js'
// import { useEffect, useState } from 'react';
// import BasketCard from '../components/BasketCard/BasketCard.jsx'
// import NavigateTo from '../utils/navBtn.jsx'

// export default function Basket () {
//     const [goods, setGoods] = useState([]);

//     const loadGoods = async () => {
//         try {
//             const data = await getBasket();
//             console.log(data)
//             setGoods(data.items);
//         } catch (error) {
//             console.error('Error loading goods: ', error);
//         }
//     };

//     const refreshGoods = () => loadGoods();

//     useEffect(() => {
//         loadGoods();
//     }, []);

//     const handleClearBasket = async () => {
//         try {
//             const resp = await deleteBasket();
//             console.log('Success on delete basket',resp)
//             loadGoods();
//         } catch (error) {
//             console.error('Error delete basket: ', error);
//         }
//     }

//     const handleCreateOrder = async () => {
//         try {
//             const resp = await createOrder();
//             console.log('Success on create order',resp)
//             loadGoods();
//         } catch (error) {
//             console.error('Error create order: ', error);
//         }
//     }


//     const orderBlock = () => {
//         const totalCount = goods.reduce((sum, item) => sum + item.quantity, 0);
        
//         const totalPrice = goods.reduce((sum, item) => sum + (item.good.price * item.quantity), 0);
        
//         return (
//             <div className="sectionOrder">
//                 <p className="totalCount">{`Total number of items: ${totalCount}`}</p>
//                 <p className="totalSum">{`Total sum: ${totalPrice} ₽`}</p>
//                 <button className="create" onClick={handleCreateOrder}>create order</button>
//             </div>
//         )
//     }

//     const renderBasketBody = (type) => {
//         if (type === "user") {
//             return (
//                 <div className="containerColumn">
//                     {goods.length > 0 && <button className="clear" onClick={handleClearBasket}>Clear basket</button>}
//                     {goods.length > 0 ? (
//                         <>
//                             {goods.map((goodItem) => (
//                                 <BasketCard
//                                     key={goodItem.id}
//                                     id={goodItem.id}
//                                     title={goodItem.good.title}
//                                     desc={goodItem.good.description}
//                                     price={goodItem.good.price}
//                                     image={goodItem.good.image}
//                                     type={type}
//                                     quantity={goodItem.quantity}
//                                     refreshGoods={refreshGoods}
//                                 />
//                             ))}
//                             {orderBlock()}
//                         </>
//                     ) : (
//                         <>
//                             <p>No products in basket</p>

//                         </>
//                     )}
//                 </div>
//             )
//         }
//         return null;
//     }

//     return (
//         <section className="basket">
//             <div className="head">
//                 < NavigateTo path="basket"/>
//                 <div className="controllers">
//                     < NavigateTo path="store"/>
//                     < NavigateTo path="orders"/>
//                     < NavigateTo path="profile"/>
//                 </div>
//             </div>
//             {renderBasketBody('user')}
//         </section>
//     )
// }


import { getBasket, deleteBasket } from '../../api/basket.js';
import { createOrder } from '../../api/orders.js';
import { useEffect, useState } from 'react';
import BasketCard from '../../components/BasketCard/BasketCard.jsx';
import NavigateTo from '../../utils/navBtn.jsx';
import styles from './Basket.module.css';

export default function Basket() {
    const [goods, setGoods] = useState([]);

    const loadGoods = async () => {
        try {
            const data = await getBasket();
            setGoods(data.items || []);
        } catch (error) {
            console.error('Error loading goods: ', error);
        }
    };

    useEffect(() => { loadGoods(); }, []);

    const totalPrice = goods.reduce((sum, item) => sum + (item.good.price * item.quantity), 0);
    const totalCount = goods.reduce((sum, item) => sum + item.quantity, 0);

    const handleClear = async () => {
        await deleteBasket();
        loadGoods();
    };

    const handleOrder = async () => {
        await createOrder();
        loadGoods();
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <NavigateTo path="basket" />
                    <nav className={styles.nav}>
                        <NavigateTo path="store" />
                        <NavigateTo path="orders" />
                        <NavigateTo path="profile" />
                    </nav>
                </div>
            </header>

            <main className={styles.container}>
                <div className={styles.content}>
                    <section className={styles.list}>
                        <h1 className={styles.title}>Корзина</h1>
                        {goods.length > 0 ? (
                            goods.map((item) => (
                                <BasketCard
                                    key={item.id}
                                    {...item.good}
                                    id={item.id}
                                    quantity={item.quantity}
                                    refreshGoods={loadGoods}
                                />
                            ))
                        ) : (
                            <div className={styles.empty}>Список пуст</div>
                        )}
                    </section>

                    {goods.length > 0 && (
                        <aside className={styles.sidebar}>
                            <div className={styles.summary}>
                                <div className={styles.row}>
                                    <span>Количество:</span>
                                    <span>{totalCount}</span>
                                </div>
                                <div className={styles.rowTotal}>
                                    <span>Итого:</span>
                                    <span className={styles.price}>{totalPrice} ₽</span>
                                </div>
                                <button className={styles.btnOrder} onClick={handleOrder}>Оформить</button>
                                <button className={styles.btnClear} onClick={handleClear}>Очистить</button>
                            </div>
                        </aside>
                    )}
                </div>
            </main>
        </div>
    );
}