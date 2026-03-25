// import { useStore } from '../store/useUserContext.jsx';
// import { useState, useEffect } from 'react';
// import { getOrdersUser, getOrdersManager } from '../api/orders.js';
// import OrderList from '../components/OrderList.jsx'
// import NavigateTo from '../utils/navBtn.jsx'

// export default function Orders () {
//     const userRole = useStore((state) => state.user?.roleID);
//     const [orders, setOrders] = useState([]);
    
//     const loadGoods = async () => {
//         try {
//             let data;
//             if (userRole === 2 || userRole === 3) {
//                 data = await getOrdersManager();
//             } else {
//                 data = await getOrdersUser();
//             }
//             console.log(data)
//             setOrders(data);
//         } catch (error) {
//             console.error('Error loading goods: ', error);
//         }
//     };
    
//     useEffect(() => {
//         loadGoods();
//     }, [userRole]);

//     const renderOrdersBody = (type) => {
//         if (type === "user") {
//             return (
//                 <div className="containerColumn">
//                     {orders.length > 0 ? (
//                         orders.map((order) => (
//                             <OrderList
//                                 key={order.id}
//                                 id={order.id}
//                                 data={order.createdAt}
//                                 status={order.status}
//                                 list={order.items}
//                                 onOrderCancelled={loadGoods}
//                             />
//                         ))
//                     ) : (
//                         <p>No orders found</p>        
//                     )}
//                 </div>
//             )
//         }
//         return null;
//     }

//     return (
//         <section className="basket">
//             <div className="head">
//                 <NavigateTo path="orders"/>
//                 <div className="controllers">
//                     <NavigateTo path="store"/>
//                     {userRole !== 2 && userRole !== 3 && <NavigateTo path="basket"/>}
//                     <NavigateTo path="profile"/>
//                 </div>
//             </div>
//             {renderOrdersBody('user')}
//         </section>
//     )
// }
import { useStore } from '../../store/useUserContext.jsx';
import { useState, useEffect } from 'react';
import { getOrdersUser, getOrdersManager } from '../../api/orders.js';
import OrderList from '../../components/OrderList/OrderList.jsx';
import NavigateTo from '../../utils/navBtn.jsx';
import styles from './Orders.module.css';

export default function Orders() {
    const userRole = useStore((state) => state.user?.roleID);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const loadOrders = async () => {
        try {
            setLoading(true);
            let data;
            // Менеджеры/Админы видят всё, юзеры — только своё
            if (userRole === 2 || userRole === 3) {
                data = await getOrdersManager();
            } else {
                data = await getOrdersUser();
            }
            setOrders(data || []);
        } catch (error) {
            console.error('Error loading orders: ', error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (userRole) loadOrders();
    }, [userRole]);

    return (
        <div className={styles.page}>
            {/* ШАПКА В ЕДИНОМ СТИЛЕ */}
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <NavigateTo path="orders" />
                    <nav className={styles.nav}>
                        <NavigateTo path="store" />
                        {userRole !== 2 && userRole !== 3 && <NavigateTo path="basket" />}
                        <NavigateTo path="profile" />
                    </nav>
                </div>
            </header>

            <main className={styles.container}>
                <h1 className={styles.title}>
                    {userRole === 2 || userRole === 3 ? 'Управление заказами' : 'Мои заказы'}
                </h1>

                <div className={styles.content}>
                    {loading ? (
                        <div className={styles.statusMsg}>Загрузка данных...</div>
                    ) : orders.length > 0 ? (
                        <div className={styles.ordersList}>
                            {orders.map((order) => (
                                <OrderList
                                    key={order.id}
                                    id={order.id}
                                    data={order.createdAt}
                                    status={order.status}
                                    list={order.items}
                                    onOrderCancelled={loadOrders}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.empty}>
                            <p>Заказов пока нет</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}