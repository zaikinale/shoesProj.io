import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from "socket.io-client";
import { getTickets, getTicketById, createTicket as apiCreateTicket, sendMessage as apiSendMessage } from '../api/tickets';
import { getOrdersUser } from '../api/orders';
import { getBackendOrigin } from '../utils/apiBase';

export const useHelp = (userRole, username) => {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [userOrders, setUserOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [typingUser, setTypingUser] = useState(null);
    
    const socketRef = useRef(null);
    const isTypingRef = useRef(false);
    const isStaff = userRole === 2 || userRole === 3;

    useEffect(() => {
        const url = getBackendOrigin();
        socketRef.current = io(url, {
            withCredentials: true,
            // Сначала polling, затем upgrade — стабильнее за прокси / dev
            transports: ['polling', 'websocket'],
        });

        socketRef.current.on("connect", () => {
            console.debug("[socket] подключено к", url);
        });
        socketRef.current.on("connect_error", (err) => {
            console.error("[socket] ошибка подключения:", err.message);
        });

        socketRef.current.on("receive_message", (msg) => {
            setSelectedTicket(prev => {
                // Если ID тикета совпадает, добавляем сообщение
                if (prev?.id === msg.ticketId) {
                    if (prev.messages?.some(m => m.id === msg.id)) return prev;
                    return { ...prev, messages: [...(prev.messages || []), msg] };
                }
                return prev;
            });
        });

        socketRef.current.on("display_typing", (data) => {
            // Чтобы статус "печатает" не мигал у всех, 
            // сервер должен слать ticketId, а мы его тут проверять
            setTypingUser(data.isTyping ? data.username : null);
        });

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, []);

    const loadTickets = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getTickets();
            setTickets(data || []);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    }, []);

    const loadOrders = useCallback(async () => {
        if (!isStaff) {
            try {
                const data = await getOrdersUser();
                setUserOrders(data || []);
            } catch (e) { console.error(e); }
        }
    }, [isStaff]);

    useEffect(() => { loadTickets(); }, [loadTickets]);

    const selectTicket = async (id) => {
        try {
            const data = await getTicketById(id);
            setSelectedTicket(data);
            setTypingUser(null);
            // Сообщаем серверу, в какой мы комнате
            socketRef.current?.emit("join_ticket", id);
        } catch (e) { console.error(e); }
    };

    const sendTypingStatus = (isTyping) => {
        if (selectedTicket && isTyping !== isTypingRef.current) {
            isTypingRef.current = isTyping;
            socketRef.current?.emit("typing", { 
                ticketId: selectedTicket.id, 
                username, 
                isTyping 
            });
        }
    };

    const sendMessage = async (text, image) => {
        if (!text && !image) return; // Можно отправить просто картинку без текста
        try {
            // 1. Сохраняем в БД
            const sent = await apiSendMessage(selectedTicket.id, { text, image });
            
            // 2. Формируем полный объект для сокета
            // ВАЖНО: берем данные из 'sent', но явно добавляем ticketId и image
            const messageData = { 
                ...sent, 
                ticketId: selectedTicket.id,
                image: image // Гарантируем, что ссылка на фото улетит в сокет
            };

            // 3. Отправляем другим через сокет
            socketRef.current?.emit("send_message", messageData);

            // 4. Обновляем у себя
            setSelectedTicket(prev => ({ 
                ...prev, 
                messages: [...(prev.messages || []), messageData] 
            }));

            sendTypingStatus(false);
            return sent;
        } catch (error) {
            console.error("Ошибка при отправке:", error);
        }
    };

    const createTicket = async (fd) => {
        try {
            const t = await apiCreateTicket({
                subject: fd.category === "order" ? `Order #${fd.orderId}` : fd.subject || "Question",
                category: fd.category === 'order' ? "Problems with the order" : "Problems with the application",
                orderId: fd.orderId ? parseInt(fd.orderId) : null
            });
            
            if (fd.firstMessage || fd.image) {
                await apiSendMessage(t.id, { text: fd.firstMessage, image: fd.image });
            }
            
            await loadTickets();
            return t;
        } catch (e) { console.error(e); }
    };

    return { 
        tickets, selectedTicket, userOrders, loading, isStaff, typingUser, 
        loadOrders, selectTicket, sendMessage, sendTypingStatus, createTicket, 
        refreshTickets: loadTickets 
    };
};