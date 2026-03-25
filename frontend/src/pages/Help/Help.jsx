import { useEffect, useState, useRef } from "react";
import { useStore } from "../../store/useUserContext";
import { useHelp } from "../../hooks/useHelp";
import NavigateTo from "../../utils/navBtn";
import styles from './Help.module.css';

export default function Help() {
    const user = useStore((state) => state.user);
    const { 
        tickets, selectedTicket, userOrders, isStaff, 
        loadOrders, selectTicket, createTicket, sendMessage 
    } = useHelp(user?.roleID);
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        subject: "", category: "Problems with the application", orderId: "", firstMessage: "", image: ""
    });
    const [newMessage, setNewMessage] = useState({ text: "", image: "" });

    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (formData.category === "Problems with the order") {
            loadOrders();
        }
    }, [formData.category, loadOrders]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [selectedTicket?.messages]);

    const handleSelect = async (id) => {
        await selectTicket(id);
        setIsFormOpen(false);
    };

    const onSubmitTicket = async (e) => {
        e.preventDefault();
        try {
            await createTicket(formData);
            setIsFormOpen(false);
            setFormData({ subject: "", category: "Problems with the application", orderId: "", firstMessage: "", image: "" });
        } catch (error) {
            alert(error.message);
        }
    };

    const onSend = async () => {
        const success = await sendMessage(newMessage.text, newMessage.image);
        if (success) setNewMessage({ text: "", image: "" });
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <NavigateTo path="store" />
                <div className={styles.nav}>
                    <NavigateTo path="orders" />
                    <NavigateTo path="profile" />
                    {!isStaff && (
                        <button className={styles.btnNew} onClick={() => {setIsFormOpen(!isFormOpen);}}>
                            {isFormOpen ? "Закрыть" : "+ Новое"}
                        </button>
                    )}
                </div>
            </header>

            <main className={styles.mainContainer}>
                <div className={styles.chatWrapper}>
                    <aside className={styles.sidebar}>
                        <div className={styles.sidebarHeader}>{isStaff ? "Все запросы" : "Мои тикеты"}</div>
                        <div className={styles.ticketList}>
                            {tickets.map(t => (
                                <div 
                                    key={t.id} 
                                    className={`${styles.ticketCard} ${selectedTicket?.id === t.id ? styles.activeCard : ''}`}
                                    onClick={() => handleSelect(t.id)}
                                >
                                    <span className={styles.tDate}>{new Date(t.createdAt).toLocaleDateString()}</span>
                                    <div className={styles.tSubject}>{t.subject}</div>
                                    {isStaff && <div className={styles.tAuthor}>от: {t.user?.username}</div>}
                                </div>
                            ))}
                        </div>
                    </aside>

                    <section className={styles.chatArea}>
                        {isFormOpen ? (
                            <form className={styles.ticketForm} onSubmit={onSubmitTicket}>
                                <h2>Новое обращение</h2>
                                <select 
                                    value={formData.category} 
                                    onChange={e => setFormData({...formData, category: e.target.value})}
                                >
                                    <option value="Problems with the application">Проблемы с приложением</option>
                                    <option value="Problems with the order">Проблема с заказом</option>
                                </select>

                                {formData.category === "Problems with the order" && (
                                    <select required onChange={e => setFormData({...formData, orderId: e.target.value})}>
                                        <option value="">Выберите заказ</option>
                                        {userOrders.map(o => (
                                            <option key={o.id} value={o.id}>Заказ №{o.id} ({o.status})</option>
                                        ))}
                                    </select>
                                )}

                                <textarea 
                                    placeholder="Опишите вашу проблему..." 
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
                                <button type="submit" className={styles.btnSubmit}>Создать тикет</button>
                            </form>
                        ) : selectedTicket ? (
                            <div className={styles.messenger}>
                                <div className={styles.messageList}>
                                    {selectedTicket.messages?.map(m => {
                                        const isMsgFromStaff = m.author?.roleID === 2 || m.author?.roleID === 3;
                                        return (
                                            <div key={m.id} className={isMsgFromStaff ? styles.messageManager : styles.messageUser}>
                                                <div className={styles.massageBody}>
                                                    {m.text}
                                                    {m.image && <img src={m.image} alt="attach" className={styles.msgImg} />}
                                                </div>
                                                <div className={styles.date}>
                                                    {new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </div>
                                            </div>
                                        )
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>
                                <div className={styles.inputSection}>
                                    <textarea 
                                        placeholder="Написать ответ..."
                                        value={newMessage.text}
                                        onChange={e => setNewMessage({...newMessage, text: e.target.value})}
                                    />
                                    <div className={styles.inputBottom}>
                                        <input 
                                            placeholder="Ссылка на фото" 
                                            value={newMessage.image}
                                            onChange={e => setNewMessage({...newMessage, image: e.target.value})}
                                        />
                                        <button onClick={onSend} className={styles.btnSend}>Отправить</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.placeholder}>Выберите тикет или создайте новый</div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}