import { useEffect, useState } from "react";
import { useStore } from "../store/useUserContext";
import NavigateTo from "../utils/navBtn";
import { getTickets, getTicketById, createTicket, sendMessage } from "../api/tickets";
import { getOrdersUser } from "../api/orders";

export default function Help() {
    const user = useStore((state) => state.user);
    const userRole = user?.roleID;
    
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [userOrders, setUserOrders] = useState([]);
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        subject: "",
        category: "Problems with the application",
        orderId: "",
        firstMessage: "",
        image: ""
    });
    const [newMessage, setNewMessage] = useState({ text: "", image: "" });

    const isStaff = userRole === 2 || userRole === 3;

    useEffect(() => {
        loadTickets();
    }, []);

    useEffect(() => {
        if (formData.category === "Problems with the order" && !isStaff) {
            getOrdersUser().then(setUserOrders).catch(console.error);
        }
    }, [formData.category, isStaff]);

    const loadTickets = async () => {
        try {
            const data = await getTickets();
            setTickets(data);
        } catch (error) {
            console.error("Error loading tickets:", error);
        }
    };

    const handleSelectTicket = async (id) => {
        try {
            const data = await getTicketById(id);
            setSelectedTicket(data);
            setIsFormOpen(false);
        } catch (error) {
            console.error("Error loading ticket details", error);
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        try {
            const ticket = await createTicket({
                subject: formData.category === "Problems with the order" 
                    ? `Order #${formData.orderId}` 
                    : formData.subject || "Application question",
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
            setFormData({ subject: "", category: "Problems with the application", orderId: "", firstMessage: "", image: "" });
            loadTickets();
        } catch (error) {
            alert("Error while creating: " + error.message);
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
            console.error("Send error:", error);
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
                            {isFormOpen ? "Close" : "+ new"}
                        </button>
                    )}
                </div>
            </div>

            <div className="container tickets-body">
                <div className="tickets-nav">
                    <h2>{isStaff ? "All requests:" : "Your requests:"}</h2>
                    {tickets.length > 0 ? tickets.map(t => (
                        <div 
                            key={t.id} 
                            className={`ticket-item ${selectedTicket?.id === t.id ? 'active' : ''}`}
                            onClick={() => handleSelectTicket(t.id)}
                        >
                            <p className="date">{new Date(t.createdAt).toLocaleDateString()}</p>
                            <h3 className="categoryName">{t.subject}</h3>
                            {isStaff && <span className="author-badge">at: {t.user?.username}</span>}
                        </div>
                    )) : <p>You have no requests</p>}
                </div>

                <div className="message-section">
                    {isFormOpen ? (
                        <form className="form ticket-form" onSubmit={handleCreateTicket}>
                            <h3>New appeal</h3>
                            <select 
                                value={formData.category} 
                                onChange={e => setFormData({...formData, category: e.target.value})}
                            >
                                <option value="Problems with the application">Problems with the application</option>
                                <option value="Problems with the order">Problems with the order</option>
                            </select>

                            {formData.category === "Problems with the order" && (
                                <select 
                                    required 
                                    onChange={e => setFormData({...formData, orderId: e.target.value})}
                                >
                                    <option value="">Select order</option>
                                    {userOrders.map(o => (
                                        <option key={o.id} value={o.id}>Order №{o.id} ({o.status})</option>
                                    ))}
                                </select>
                            )}

                            <textarea 
                                placeholder="Your message..." 
                                required
                                value={formData.firstMessage}
                                onChange={e => setFormData({...formData, firstMessage: e.target.value})}
                            />
                            <input 
                                type="text" 
                                placeholder="Link on img (not mandatory)" 
                                value={formData.image}
                                onChange={e => setFormData({...formData, image: e.target.value})}
                            />
                            <button type="submit">Send request</button>
                        </form>
                    ) : selectedTicket ? (
                        <>
                            <div className="message-list">
                                {selectedTicket.messages?.map(m => {
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
                                    placeholder="Message..."
                                    value={newMessage.text}
                                    onChange={e => setNewMessage({...newMessage, text: e.target.value})}
                                />
                                <div className="controls">
                                    <input 
                                        type="text" 
                                        className="message-text`"
                                        placeholder="Link on image" 
                                        value={newMessage.image}
                                        onChange={e => setNewMessage({...newMessage, image: e.target.value})}
                                    />
                                    <button onClick={handleSendMessage}>send</button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="empty-state">Select a ticket to view the conversation</div>
                    )}
                </div>
            </div>
        </section>
    );
}