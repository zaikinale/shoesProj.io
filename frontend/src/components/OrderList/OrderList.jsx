// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useStore } from '../store/useUserContext.jsx';
// import { cancelOrder, changeStatusOrder } from "../api/orders";
// import ArrowRightIcon from '../assets/arrow-right.svg'


// /* eslint-disable react/prop-types */
// export default function OrderList({ id, data, status, list, onOrderCancelled }) {
//     const [selectedValue, setSelectedValue] = useState(status);
//     const userRole = useStore((state) => state.user?.roleID);

//     const renderControl = () => {
//         if (userRole === 2 || userRole === 3) {
//             return (
//                 <select value={selectedValue} name="select" onChange={(e) => handleChangeStatus(e.target.value)}>
//                     <option value="created">created</option>
//                     <option value="processing">processing</option>
//                     <option value="shipped">shipped</option>
//                     <option value="delivered">delivered</option>
//                     <option value="cancelled">cancelled</option>
//                 </select>
//             )
//         } else {
//             return null
//         }
//     }

//     const formatDate = (dateString) => {
//         if (!dateString) return '';

//         const date = new Date(dateString);
//         if (isNaN(date)) return dateString;

//         const day = String(date.getUTCDate()).padStart(2, '0');
//         const month = String(date.getUTCMonth() + 1).padStart(2, '0');
//         const year = date.getUTCFullYear();

//         const hours = String(date.getUTCHours()).padStart(2, '0');
//         const minutes = String(date.getUTCMinutes()).padStart(2, '0');

//         return `${day}.${month}.${year} в ${hours}:${minutes}`;
//     }

//     const handleChangeStatus = async (statusNew) => {
//         setSelectedValue(statusNew);
//         try {
//             const resp = await changeStatusOrder(id, statusNew);
//             console.log('Change status order success: ', resp);
//         } catch (error) {
//             console.error('Change status order error: ', error);
//         }
//     }

//     const handleCancelOrder = async () => {
//         try {
//             const resp = await cancelOrder(id);
//             console.log('Cancel order: ', resp);
//             if (onOrderCancelled) {
//                 onOrderCancelled(id);
//             }
//         } catch (error) {
//             console.error('Cancel order error: ', error);
//         }
//     }

//     const renderCancelBtn = () => {
//         if (status !== 'shipped' && status !== 'delivered' && status !== 'cancelled') {
//             return (
//                 <button className="status" onClick={handleCancelOrder}>Cancel order</button>
//             )
//         }
//         return null
//     }

//     const renderInfoBtn = () => {
//         return (
//             <Link to={`/order/${id}`} className="more-info-link">
//                 <button className="more-info controls" type="button">
//                     <p>More info</p>
//                     <img src={ArrowRightIcon} alt="go to"/>
//                 </button>
//             </Link>
//         )
//     }

//     const renderListGood = (goodItem) => {
//         return (
//             <Link to={`/good/${goodItem.good.id}`} key={goodItem.id}>
//                 <div className="cardSmall">
//                     <img src={goodItem.good.image} alt={goodItem.good.title} className="imgSmall" />
//                     <h3 className="title">{goodItem.good.title}</h3>
//                 </div>
//             </Link>
//         )
//     }

//     return (
//         <div className="order">
//             <h2 className="title">{`Заказ от ${formatDate(data)}`}</h2>
//             <span className="status">{`status: ${selectedValue}`}</span>
//             <div className="goodsList">
//                 {list.map((good) => renderListGood(good))}
//             </div>
//             <div className="controlsOrder">
//                 {renderCancelBtn()}
//                 {renderInfoBtn()}
//                 {renderControl()}
//             </div>
//         </div>
//     )
// }

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useUserContext.jsx';
import { cancelOrder, changeStatusOrder } from "../../api/orders";
import ArrowRightIcon from '../../assets/arrow-right.svg';
import styles from './OrderList.module.css';

export default function OrderList({ id, data, status, list, onOrderCancelled }) {
    const [currentStatus, setCurrentStatus] = useState(status);
    const userRole = useStore((state) => state.user?.roleID);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}.${month} в ${hours}:${minutes}`;
    };

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        setCurrentStatus(newStatus);
        try {
            await changeStatusOrder(id, newStatus);
        } catch (error) {
            console.error('Status error:', error);
        }
    };

    const handleCancel = async () => {
        if (!window.confirm("Отменить этот заказ?")) return;
        try {
            await cancelOrder(id);
            if (onOrderCancelled) onOrderCancelled(id);
        } catch (error) {
            console.error('Cancel error:', error);
        }
    };

    return (
        <div className={styles.orderCard}>
            <div className={styles.orderCard__header}>
                <div className={styles.orderCard__mainInfo}>
                    <h2 className={styles.orderCard__id}>
                        Заказ №{String(id).slice(-6).toUpperCase()}
                    </h2>
                    <span className={styles.orderCard__date}>{formatDate(data)}</span>
                </div>
                
                <div className={`${styles.orderCard__statusBadge} ${styles[`status--${currentStatus}`]}`}>
                    {currentStatus}
                </div>
            </div>

            <div className={styles.orderCard__content}>
                <div className={styles.orderCard__goods}>
                    {list.map((item) => (
                        <Link to={`/good/${item.good.id}`} key={item.id} className={styles.goodPreview}>
                            <img src={item.good.image} alt="" className={styles.goodPreview__img} />
                            <span className={styles.goodPreview__count}>x{item.quantity}</span>
                        </Link>
                    ))}
                </div>

                <div className={styles.orderCard__actions}>
                    {/* Кнопка "Подробнее" */}
                    <Link to={`/order/${id}`} className={styles.btnInfo}>
                        <span>Детали</span>
                        <img src={ArrowRightIcon} alt="" />
                    </Link>

                    {/* Отмена для юзера */}
                    {['created', 'processing'].includes(currentStatus) && (
                        <button className={styles.btnCancel} onClick={handleCancel}>
                            Отменить
                        </button>
                    )}

                    {/* Управление для менеджера */}
                    {(userRole === 2 || userRole === 3) && (
                        <div className={styles.managerControl}>
                            <select value={currentStatus} onChange={handleStatusChange} className={styles.statusSelect}>
                                <option value="created">Created</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}