import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useStore } from "../../store/useUserContext";
import { useHelp } from "../../hooks/useHelp";
import styles from './Help.module.css';

export default function Help() {
    const navigate = useNavigate();
    const user = useStore((state) => state.user);

    // Добавили user.id третьим аргументом и достали markAsRead
    const { 
        tickets, selectedTicket, userOrders, isStaff, typingUser,
        loadOrders, selectTicket, createTicket, sendMessage, sendTypingStatus,
        markAsRead 
    } = useHelp(user?.roleID, user?.username, user?.id);
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({ subject: "", category: "tech", orderId: "", firstMessage: "", image: "" });
    const [newMessage, setNewMessage] = useState({ text: "", image: "" });
    const messagesEndRef = useRef(null);

    // Автоматическое прочтение при выборе тикета или получении сообщения
    useEffect(() => {
        if (selectedTicket?.id && selectedTicket.messages?.length > 0) {
            const messages = selectedTicket.messages;
            const lastMessage = messages[messages.length - 1];

            // Если последнее сообщение прислал не текущий пользователь и оно не прочитано
            if (lastMessage.authorId !== user?.id && !lastMessage.viewed) {
                markAsRead(selectedTicket.id);
            }
        }
    }, [selectedTicket?.id, selectedTicket?.messages?.length, user?.id, markAsRead]);

    useEffect(() => {
        if (formData.category === "order") loadOrders();
    }, [formData.category, loadOrders]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [selectedTicket?.messages?.length, typingUser]);

    const onSend = async () => {
        if (!newMessage.text.trim() && !newMessage.image.trim()) return;
        
        const success = await sendMessage(newMessage.text, newMessage.image);
        if (success) {
            setNewMessage({ text: "", image: "" });
            sendTypingStatus(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <button className="btn" onClick={() => navigate('/store')}>Главная</button>
                <div className={styles.nav}>
                    <button className="btn" onClick={() => navigate('/orders')}>Заказы</button>
                    <button className="btn" onClick={() => navigate('/profile')}>Профиль</button>
                    {!isStaff && (
                        <button className={styles.btnNew} onClick={() => setIsFormOpen(!isFormOpen)}>
                            {isFormOpen ? "Назад" : "+ Новый тикет"}
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
                                <div key={t.id} 
                                    className={`${styles.ticketCard} ${selectedTicket?.id === t.id ? styles.activeCard : ''}`}
                                    onClick={() => { selectTicket(t.id); setIsFormOpen(false); }}>
                                    <div className={styles.tHeader}>
                                        <span className={t.category?.includes("order") ? styles.badgeOrder : styles.badgeTech}>
                                            {t.category?.includes("order") ? 'Заказ' : 'Тех'}
                                        </span>
                                        {/* Индикатор количества непрочитанных */}
                                        {t._count?.messages > 0 && (
                                            <span className={styles.unreadBadge}>{t._count.messages}</span>
                                        )}
                                        <span className={styles.tDate}>{new Date(t.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className={styles.tSubject}>{t.subject}</div>
                                    {isStaff && <div className={styles.tAuthor}>от: {t.user?.username}</div>}
                                </div>
                            ))}
                        </div>
                    </aside>

                    <section className={styles.chatArea}>
                        {isFormOpen ? (
                            <div className={styles.formScroll}>
                                <div className={styles.formContainer}>
                                    <form className={styles.ticketForm} onSubmit={async (e) => {
                                        e.preventDefault();
                                        await createTicket(formData);
                                        setIsFormOpen(false);
                                        setFormData({ subject: "", category: "tech", orderId: "", firstMessage: "", image: "" });
                                    }}>
                                        <h2>Новое обращение</h2>
                                        <div className={styles.inputGroup}>
                                            <label>Категория</label>
                                            <div className={styles.chips}>
                                                <button type="button" className={formData.category === 'tech' ? styles.activeChip : ''} onClick={() => setFormData({...formData, category: 'tech', orderId: ''})}>Техническая</button>
                                                <button type="button" className={formData.category === 'order' ? styles.activeChip : ''} onClick={() => setFormData({...formData, category: 'order'})}>По заказу</button>
                                            </div>
                                        </div>
                                        {formData.category === "order" && (
                                            <div className={styles.inputGroup}>
                                                <label>Выберите заказ</label>
                                                <select required onChange={e => setFormData({...formData, orderId: e.target.value})}>
                                                    <option value="">Номер заказа...</option>
                                                    {userOrders.map(o => <option key={o.id} value={o.id}>№{o.id} — {o.status}</option>)}
                                                </select>
                                            </div>
                                        )}
                                        <div className={styles.inputGroup}>
                                            <label>Сообщение</label>
                                            <textarea required value={formData.firstMessage} onChange={e => setFormData({...formData, firstMessage: e.target.value})} placeholder="Опишите проблему..." />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <label>Скриншот (URL)</label>
                                            <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://..." />
                                            {formData.image && <img src={formData.image} className={styles.previewImg} alt="Preview" />}
                                        </div>
                                        <button type="submit" className={styles.btnSubmit}>Создать</button>
                                    </form>
                                </div>
                            </div>
                        ) : selectedTicket ? (
                            <div className={styles.messenger}>
                                <div className={styles.messageList}>
                                    {selectedTicket.messages?.map(m => (
                                        <div key={m.id} className={(m.author?.roleID === 2 || m.author?.roleID === 3) ? styles.messageManager : styles.messageUser}>
                                            <div className={styles.massageBody}>
                                                {m.text && <p>{m.text}</p>}
                                                {m.image && (
                                                    <a href={m.image} target="_blank" rel="noreferrer">
                                                        <img src={m.image} alt="attach" className={styles.msgImg} />
                                                    </a>
                                                )}
                                            </div>
                                            <div className={styles.info}>
                                                {/* Показываем статус только для сообщений текущего пользователя */}
                                                {m.authorId === user?.id && (
                                                    <span className={m.viewed ? styles.statusViewed : styles.statusSent}>
                                                        {m.viewed ? 'Просмотрено ✓✓' : 'Отправлено ✓'}
                                                    </span>
                                                )}
                                                <div className={styles.date}>{new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                            </div>
                                        </div>
                                    ))}
                                    {typingUser && (
                                        <div className={styles.typingIndicator}>
                                            <div className={styles.dots}><span></span><span></span><span></span></div>
                                            <small>{typingUser} печатает...</small>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                                <div className={styles.inputSection}>
                                    <textarea 
                                        value={newMessage.text} 
                                        onChange={(e) => { 
                                            setNewMessage({...newMessage, text: e.target.value}); 
                                            sendTypingStatus(e.target.value.length > 0); 
                                        }} 
                                        onBlur={() => sendTypingStatus(false)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Введите сообщение..." 
                                    />
                                    <div className={styles.inputBottom}>
                                        <input 
                                            className={styles.imgInput}
                                            placeholder="URL изображения (https://...)" 
                                            value={newMessage.image} 
                                            onChange={e => setNewMessage({...newMessage, image: e.target.value})} 
                                        />
                                        <button onClick={onSend} className={styles.btnSend}>Отправить</button>
                                    </div>
                                    {newMessage.image && <img src={newMessage.image} className={styles.smallPreview} alt="Small Preview" />}
                                </div>
                            </div>
                        ) : <div className={styles.placeholder}>Выберите диалог для начала общения</div>}
                    </section>
                </div>
            </main>
        </div>
    );
}