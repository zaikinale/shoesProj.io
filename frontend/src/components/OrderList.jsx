import { useState } from 'react';
import { Link } from 'react-router';
import { useStore } from '../store/useUserContext.jsx';
import { cancelOrder, changeStatusOrder } from "../api/orders"

/* eslint-disable react/prop-types */
export default function OrderList({ id, data, status, list, onOrderCancelled }) {
    const [selectedValue, setSelectedValue] = useState(status);
    const userRole = useStore((state) => state.user?.roleID);

    const renderControl = () => {
        if (userRole === 2 || userRole === 3) { 
            return (
                <select value={selectedValue} name="select" onChange={(e) => handleChangeStatus(e.target.value)}>
                    <option value="created">created</option>
                    <option value="processing">processing</option>
                    <option value="shipped">shipped</option>
                    <option value="delivered">delivered</option>
                    <option value="cancelled">cancelled</option>
                </select>
            )
        } else {
            return null
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        if (isNaN(date)) return dateString;
        
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        
        return `${day}.${month}.${year} в ${hours}:${minutes}`;
    }

    const handleChangeStatus = async (statusNew) => {
        setSelectedValue(statusNew);
        try {
            const resp = await changeStatusOrder(id, statusNew);
            console.log('Change status order success: ', resp);
        } catch (error) {
            console.error('Change status order error: ', error);
        }
    }

    const handleCancelOrder = async () => {
        try {
            const resp = await cancelOrder(id);
            console.log('Cancel order: ', resp);
            if (onOrderCancelled) {
                onOrderCancelled(id);
            }
        } catch (error) {
            console.error('Cancel order error: ', error);
        }
    }

    const renderCancelBtn = () => {
        if (status !== 'shipped' && status !== 'delivered' && status !== 'cancelled') {
            return (
                <button className="status" onClick={handleCancelOrder}>Cancel order</button>
            )
        }
        return null
    }

    const renderListGood = (goodItem) => {
        return (
            <Link to={`/good/${goodItem.good.id}`}>
                <div className="cardSmall" key={goodItem.id}>
                    <img src={goodItem.good.image} alt={goodItem.good.title} className="imgSmall" />
                    <h3 className="title">{goodItem.good.title}</h3>
                </div>
            </ Link>
        )
    }

    return (
        <div className="order">
            <h2 className="title">{`Заказ от ${formatDate(data)}`}</h2>
            <span className="status">{selectedValue}</span>
            <div className="goodsList">
                {list.map((good) => renderListGood(good))}
            </div>
            <div className="controlsOrder">
                {renderCancelBtn()}
                {renderControl()}
            </div>
        </div>
    )
}