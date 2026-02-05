
import { useStore } from '../store/useUserContext.jsx';
import { useState, useEffect } from 'react';
import { getOrdersUser, getOrdersManager } from '../api/orders.js';
import OrderList from '../components/OrderList.jsx'
import NavigateTo from '../utils/navBtn.jsx'

export default function Orders () {
    const userRole = useStore((state) => state.user?.roleID);
    const [orders, setOrders] = useState([]);
    
    const loadGoods = async () => {
        try {
            let data;
            if (userRole === 2 || userRole === 3) {
                data = await getOrdersManager();
            } else {
                data = await getOrdersUser();
            }
            console.log(data)
            setOrders(data);
        } catch (error) {
            console.error('Error loading goods: ', error);
        }
    };
    
    useEffect(() => {
        loadGoods();
    }, []);

    const renderOrdersBody = (type) => {
        if (type === "user") {
            return (
                <div className="containerColumn">
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <OrderList
                                key={order.id}
                                id={order.id}
                                data={order.createdAt}
                                status={order.status}
                                list={order.items}
                            />
                        ))
                    ) : (
                        <p>No orders found</p>        
                    )}
                </div>
            )
        }
        return null;
    }

    return (
        <section className="basket">
            <h1 className="head">
                < NavigateTo path="orders"/>
                <div className="controllers">
                    <NavigateTo path="store"/>
                    {userRole !== 2 && userRole !== 3 && <NavigateTo path="basket"/>}
                    <NavigateTo path="logout"/>
                </div>
            </h1>
            {renderOrdersBody('user')}
        </section>
    )
}