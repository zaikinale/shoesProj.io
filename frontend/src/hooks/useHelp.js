import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from "socket.io-client";
import { 
    getTickets, 
    getTicketById, 
    createTicket as apiCreateTicket, 
    sendMessage as apiSendMessage,
    markAsRead as apiMarkAsRead 
} from '../api/tickets';
import { getOrdersUser } from '../api/orders';
import { getBackendOrigin } from '../utils/apiBase';

/**
 * Хук для управления логикой тикетов и чата
 * @param {number} userRole - ID роли пользователя
 * @param {string} username - Имя пользователя
 * @param {number} currentUserId - ID текущего пользователя (из стора/контекста)
 */
export const useHelp = (userRole, username, currentUserId) => {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [userOrders, setUserOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [typingUser, setTypingUser] = useState(null);
    
    const socketRef = useRef(null);
    const isTypingRef = useRef(false);
    const isStaff = userRole === 2 || userRole === 3;

    // --- ЛОГИКА ПРОЧТЕНИЯ ---

    const markAsRead = useCallback(async (ticketId) => {
        if (!ticketId || !currentUserId) return;
        
        try {
            const success = await apiMarkAsRead(ticketId);
            if (success) {
                // Уведомляем собеседника через сокет, что мы прочитали сообщения
                socketRef.current?.emit("read_messages", { 
                    ticketId, 
                    userId: currentUserId 
                });
                
                // Сбрасываем счетчик непрочитанных локально в списке тикетов
                setTickets(prev => prev.map(t => 
                    t.id === ticketId 
                        ? { ...t, _count: { ...t._count, messages: 0 } } 
                        : t
                ));
            }
        } catch (e) {
            console.error("[markAsRead] Error:", e);
        }
    }, [currentUserId]);

    // --- РАБОТА С SOCKET.IO ---

    useEffect(() => {
        const url = getBackendOrigin();
        socketRef.current = io(url, {
            withCredentials: true,
            transports: ['polling', 'websocket'],
        });

        // Слушаем входящие сообщения
        socketRef.current.on("receive_message", (msg) => {
            setSelectedTicket(prev => {
                if (prev?.id === msg.ticketId) {
                    // Если чат открыт и сообщение чужое — помечаем прочитанным
                    if (msg.authorId !== currentUserId) {
                        markAsRead(msg.ticketId);
                    }
                    
                    // Избегаем дубликатов
                    if (prev.messages?.some(m => m.id === msg.id)) return prev;
                    return { ...prev, messages: [...(prev.messages || []), msg] };
                }
                return prev;
            });

            // Если сообщение пришло в другой тикет — обновляем общий список (счетчики)
            if (selectedTicket?.id !== msg.ticketId) {
                loadTickets();
            }
        });

        // Слушаем подтверждение прочтения от другого пользователя
        socketRef.current.on("messages_read", (data) => {
            setSelectedTicket(prev => {
                if (prev?.id === data.ticketId) {
                    return {
                        ...prev,
                        messages: prev.messages.map(m => ({ ...m, viewed: true }))
                    };
                }
                return prev;
            });
        });

        socketRef.current.on("display_typing", (data) => {
            setTypingUser(data.isTyping ? data.username : null);
        });

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, [currentUserId, selectedTicket?.id, markAsRead]);

    // --- ЗАГРУЗКА ДАННЫХ ---

    const loadTickets = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getTickets();
            setTickets(data || []);
        } catch (e) {
            console.error("[loadTickets] Error:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    const loadOrders = useCallback(async () => {
        if (!isStaff) {
            try {
                const data = await getOrdersUser();
                setUserOrders(data || []);
            } catch (e) {
                console.error("[loadOrders] Error:", e);
            }
        }
    }, [isStaff]);

    useEffect(() => {
        loadTickets();
    }, [loadTickets]);

    // --- ДЕЙСТВИЯ ---

    const selectTicket = async (id) => {
        try {
            const data = await getTicketById(id);
            setSelectedTicket(data);
            setTypingUser(null);
            
            // Входим в комнату сокета для этого тикета
            socketRef.current?.emit("join_ticket", id);
            
            // Сбрасываем визуальный счетчик в сайдбаре
            setTickets(prev => prev.map(t => 
                t.id === id ? { ...t, _count: { ...t._count, messages: 0 } } : t
            ));
        } catch (e) {
            console.error("[selectTicket] Error:", e);
        }
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
        if (!text && !image || !selectedTicket) return;
        try {
            const sent = await apiSendMessage(selectedTicket.id, { text, image });

            // Формируем данные для сокета (добавляем ticketId, если бэкенд его не вернул)
            const messageData = {
                ...sent,
                ticketId: selectedTicket.id
            };

            // Отправляем через сокет остальным
            socketRef.current?.emit("send_message", messageData);

            // Добавляем себе в список
            setSelectedTicket(prev => ({ 
                ...prev, 
                messages: [...(prev.messages || []), messageData] 
            }));

            sendTypingStatus(false);
            return sent;
        } catch (error) {
            console.error("[sendMessage] Error:", error);
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
        } catch (e) {
            console.error("[createTicket] Error:", e);
        }
    };

    return { 
        tickets, 
        selectedTicket, 
        userOrders, 
        loading, 
        isStaff, 
        typingUser, 
        loadOrders, 
        selectTicket, 
        sendMessage, 
        sendTypingStatus, 
        createTicket,
        markAsRead, 
        refreshTickets: loadTickets 
    };
};