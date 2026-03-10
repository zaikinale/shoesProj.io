// import { useEffect, useState } from "react";
// import { useStore } from "zustand";
// import NavigateTo from "../utils/navBtn"


// export default function Help () {
//     // const userRole = useStore((state) => state.user?.roleID);
//     // const [tickets, setTickets] = useState([]);
    
//     // const loadGoods = async () => {
//         // try {
//         //     let data;
//         //     if (userRole === 2 || userRole === 3) {
//         //         data = await getOrdersManager();
//         //     } else {
//         //         data = await getOrdersUser();
//         //     }
//         //     console.log(data)
//         //     setOrders(data);
//         // } catch (error) {
//         //     console.error('Error loading goods: ', error);
//         // }
//     // };
    
//     // useEffect(() => {
//         // loadGoods();
//     // }, [userRole]);

//     // const ticketsList = [
//     //     {
//     //         id: 1,
//     //         cratedAt: 
//     //     }
//     // ]

//     const handleFromTicket = () => {
//         return (
//             <div className="form ticket-form">
//                 <textarea name="text" id="" placeholder="Ваше обращение"></textarea>
//                 <input type="text" placeholder="Ссылка на изображение" />
//                 <label htmlFor="">Выберите тематику:</label>
//                 <select name="" id="">
//                     <option value="Проблемы с приложением">Проблемы с приложением</option>
//                     <option value="Проблемы с заказом">Проблемы с заказом</option>
//                 </select>
//             </div>
//         )
//     }


//     return (
//         <section className="help">
//             <div className="head">
//                 <NavigateTo path="orders"/>
//                 <div className="controllers">
//                     <NavigateTo path="store"/>
//                     {/* {userRole !== 2 && userRole !== 3 && <NavigateTo path="basket"/>} */}
//                     <NavigateTo path="profile"/>
//                     <button onClick={handleFromTicket}>+ new</button>
//                 </div>
//             </div>
//             <div className="container tickets-body">
//                 <div className="tickets-nav">
//                     <h2>Ваши обращения:</h2>
//                     <div className="ticket-item">
//                         <p className="date">23.04.2000</p>
//                         <h3 className="categoryName">
//                             Проблема с заказом 122212
//                         </h3>
//                     </div>
//                     <div className="ticket-item">
//                         <p className="date">23.04.2005</p>
//                         <h3 className="categoryName">
//                             Проблема с приложением
//                         </h3>
//                     </div>
//                     <div className="ticket-item">
//                         <p className="date">23.04.2300</p>
//                         <h3 className="categoryName">
//                             Проблема с заказом 132312
//                         </h3>
//                     </div>
//                 </div>
//                 <div className="message-section">
//                     <div className="message-list">
//                         <div className="message-manager">
//                             <div className="massage-body">Проблема в Дане Забелином</div>
//                             <div className="date">13:00 10.03.26</div>
//                         </div>
//                         <div className="message-user">
//                             <div className="massage-body">Я тоже в этом уверен</div>
//                             <div className="date">13:00 10.03.26</div>
//                         </div>
//                         <div className="message-manager">
//                             <div className="massage-body">Проблема в Дане Забелином</div>
//                             <div className="date">13:00 10.03.26</div>
//                         </div>
//                         <div className="message-user">
//                             <div className="massage-body">Я тоже в этом уверен</div>
//                             <div className="date">13:00 10.03.26</div>
//                         </div>
//                         <div className="message-manager">
//                             <div className="massage-body">Проблема в Дане Забелином</div>
//                             <div className="date">13:00 10.03.26</div>
//                         </div>
//                         <div className="message-user">
//                             <div className="massage-body">Я тоже в этом уверен</div>
//                             <div className="date">13:00 10.03.26</div>
//                         </div>
//                         <div className="message-manager">
//                             <div className="massage-body">Проблема в Дане Забелином</div>
//                             <div className="date">13:00 10.03.26</div>
//                         </div>
//                         <div className="message-user">
//                             <div className="massage-body">Я тоже в этом уверен</div>
//                             <div className="date">13:00 10.03.26</div>
//                         </div>
//                         <div className="message-manager">
//                             <div className="massage-body">Проблема в Дане Забелином</div>
//                             <div className="date">13:00 10.03.26</div>
//                         </div>
//                         <div className="message-user">
//                             <div className="massage-body">Я тоже в этом уверен</div>
//                             <div className="date">13:00 10.03.26</div>
//                         </div>
//                         <div className="message-manager">
//                             <div className="massage-body">Проблема в Дане Забелином</div>
//                             <div className="date">13:00 10.03.26</div>
//                         </div>
//                         <div className="message-user">
//                             <div className="massage-body">Я тоже в этом уверен</div>
//                             <div className="date">13:00 10.03.26</div>
//                         </div>
//                         <div className="message-manager">
//                             <div className="massage-body">Проблема в Дане Забелином</div>
//                             <div className="date">13:00 10.03.26</div>
//                         </div>
//                         <div className="message-user">
//                             <div className="massage-body">Я тоже в этом уверен</div>
//                             <div className="date">13:00 10.03.26</div>
//                         </div>
//                         <div className="message-manager">
//                             <div className="massage-body">Проблема в Дане Забелином</div>
//                             <div className="date">13:00 10.03.26</div>
//                         </div>
//                         <div className="message-user">
//                             <div className="massage-body">Я тоже в этом уверен</div>
//                             <div className="date">13:00 10.03.26</div>
//                         </div>


//                         У вас нет обращений
//                     </div>
//                         <div className="message-form">
//                             <textarea className="message-text" name="body" id="" placeholder="Сообщение..."></textarea>
//                             <div className="controls">
//                                 <input type="text" placeholder="Ссылка на изображение" />
//                                 <button>Отправить</button>
//                             </div>
//                         </div>
//                     </div>
//             </div>
//         </section>
//     )
// }
import { useEffect, useState } from "react";
import { useStore } from "../store/useUserContext"; // Путь к твоему стору
import NavigateTo from "../utils/navBtn";
import { getTickets, getTicketById, createTicket, sendMessage } from "../api/tickets";
import { getOrdersUser } from "../api/orders";

export default function Help() {
    const user = useStore((state) => state.user);
    const userRole = user?.roleID;
    
    // Состояния данных
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [userOrders, setUserOrders] = useState([]);
    
    // Состояния UI и Формы
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        subject: "",
        category: "Проблемы с приложением",
        orderId: "",
        firstMessage: "",
        image: ""
    });
    const [newMessage, setNewMessage] = useState({ text: "", image: "" });

    const isStaff = userRole === 2 || userRole === 3;

    useEffect(() => {
        loadTickets();
    }, []);

    // Загружаем заказы только если юзер открыл форму и выбрал категорию заказа
    useEffect(() => {
        if (formData.category === "Проблемы с заказом" && !isStaff) {
            getOrdersUser().then(setUserOrders).catch(console.error);
        }
    }, [formData.category, isStaff]);

    const loadTickets = async () => {
        try {
            const data = await getTickets();
            setTickets(data);
        } catch (error) {
            console.error("Ошибка загрузки тикетов:", error);
        }
    };

    const handleSelectTicket = async (id) => {
        try {
            const data = await getTicketById(id);
            setSelectedTicket(data);
            setIsFormOpen(false);
        } catch (error) {
            console.error("Ошибка загрузки деталей тикета:", error);
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        try {
            const ticket = await createTicket({
                subject: formData.category === "Проблемы с заказом" 
                    ? `Заказ #${formData.orderId}` 
                    : formData.subject || "Вопрос по приложению",
                category: formData.category,
                orderId: formData.orderId ? parseInt(formData.orderId) : null
            });

            if (formData.firstMessage) {
                await sendMessage(ticket.id, { 
                    text: formData.firstMessage, 
                    image: formData.image 
                });
            }

            setIsFormOpen(false);
            setFormData({ subject: "", category: "Проблемы с приложением", orderId: "", firstMessage: "", image: "" });
            loadTickets();
        } catch (error) {
            alert("Ошибка при создании: " + error.message);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.text || !selectedTicket) return;
        try {
            const sent = await sendMessage(selectedTicket.id, newMessage);
            setSelectedTicket(prev => ({
                ...prev,
                messages: [...prev.messages, sent]
            }));
            setNewMessage({ text: "", image: "" });
        } catch (error) {
            console.error("Ошибка отправки:", error);
        }
    };

    return (
        <section className="help">
            <div className="head">
                <NavigateTo path="orders" />
                <div className="controllers">
                    <NavigateTo path="store" />
                    <NavigateTo path="profile" />
                    {!isStaff && (
                        <button onClick={() => setIsFormOpen(!isFormOpen)}>
                            {isFormOpen ? "Закрыть" : "+ new"}
                        </button>
                    )}
                </div>
            </div>

            <div className="container tickets-body">
                {/* Левая панель: Список тикетов */}
                <div className="tickets-nav">
                    <h2>{isStaff ? "Все обращения:" : "Ваши обращения:"}</h2>
                    {tickets.length > 0 ? tickets.map(t => (
                        <div 
                            key={t.id} 
                            className={`ticket-item ${selectedTicket?.id === t.id ? 'active' : ''}`}
                            onClick={() => handleSelectTicket(t.id)}
                        >
                            <p className="date">{new Date(t.createdAt).toLocaleDateString()}</p>
                            <h3 className="categoryName">{t.subject}</h3>
                            {isStaff && <span className="author-badge">от: {t.user?.username}</span>}
                        </div>
                    )) : <p>У вас нет обращений</p>}
                </div>

                {/* Правая панель: Чат или Форма */}
                <div className="message-section">
                    {isFormOpen ? (
                        <form className="form ticket-form" onSubmit={handleCreateTicket}>
                            <h3>Новое обращение</h3>
                            <select 
                                value={formData.category} 
                                onChange={e => setFormData({...formData, category: e.target.value})}
                            >
                                <option value="Проблемы с приложением">Проблемы с приложением</option>
                                <option value="Проблемы с заказом">Проблемы с заказом</option>
                            </select>

                            {formData.category === "Проблемы с заказом" && (
                                <select 
                                    required 
                                    onChange={e => setFormData({...formData, orderId: e.target.value})}
                                >
                                    <option value="">Выберите заказ</option>
                                    {userOrders.map(o => (
                                        <option key={o.id} value={o.id}>Заказ №{o.id} ({o.status})</option>
                                    ))}
                                </select>
                            )}

                            <textarea 
                                placeholder="Ваше сообщение..." 
                                required
                                value={formData.firstMessage}
                                onChange={e => setFormData({...formData, firstMessage: e.target.value})}
                            />
                            <input 
                                type="text" 
                                placeholder="Ссылка на скриншот (необязательно)" 
                                value={formData.image}
                                onChange={e => setFormData({...formData, image: e.target.value})}
                            />
                            <button type="submit">Отправить запрос</button>
                        </form>
                    ) : selectedTicket ? (
                        <>
                            <div className="message-list">
                                {selectedTicket.messages?.map(m => {
                                    // Если автор сообщения имеет роль 2 или 3 — это менеджер
                                    const isMsgFromStaff = m.author?.roleID === 2 || m.author?.roleID === 3;
                                    return (
                                        <div key={m.id} className={isMsgFromStaff ? "message-manager" : "message-user"}>
                                            <div className="massage-body">
                                                {m.text}
                                                {m.image && <img src={m.image} alt="attach" className="msg-img" />}
                                            </div>
                                            <div className="date">
                                                {new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="message-form">
                                <textarea 
                                    className="message-text" 
                                    placeholder="Сообщение..."
                                    value={newMessage.text}
                                    onChange={e => setNewMessage({...newMessage, text: e.target.value})}
                                />
                                <div className="controls">
                                    <input 
                                        type="text" 
                                        placeholder="Ссылка на изображение" 
                                        value={newMessage.image}
                                        onChange={e => setNewMessage({...newMessage, image: e.target.value})}
                                    />
                                    <button onClick={handleSendMessage}>Отправить</button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="empty-state">Выберите тикет для просмотра переписки</div>
                    )}
                </div>
            </div>
        </section>
    );
}