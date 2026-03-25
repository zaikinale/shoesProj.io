import { useState, useEffect, useCallback } from 'react';
import { getTickets, getTicketById, createTicket as apiCreateTicket, sendMessage as apiSendMessage } from '../api/tickets';
import { getOrdersUser } from '../api/orders';

export const useHelp = (userRole) => {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [userOrders, setUserOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const isStaff = userRole === 2 || userRole === 3;

    const loadTickets = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getTickets();
            setTickets(data || []);
        } catch (error) {
            console.error('Error loading tickets:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const loadOrders = useCallback(async () => {
        if (isStaff) return;
        try {
            const data = await getOrdersUser();
            setUserOrders(data || []);
        } catch (error) {
            console.error('Error loading orders:', error);
        }
    }, [isStaff]);

    useEffect(() => {
        loadTickets();
    }, [loadTickets]);

    const selectTicket = async (id) => {
        try {
            const data = await getTicketById(id);
            setSelectedTicket(data);
            return data;
        } catch (error) {
            console.error(error);
        }
    };

    const createTicket = async (formData) => {
        const ticket = await apiCreateTicket({
            subject: formData.category === "Problems with the order" 
                ? `Order #${formData.orderId}` 
                : formData.subject || "Application question",
            category: formData.category,
            orderId: formData.orderId ? parseInt(formData.orderId) : null
        });

        if (formData.firstMessage) {
            await apiSendMessage(ticket.id, { 
                text: formData.firstMessage, 
                image: formData.image 
            });
        }
        
        await loadTickets();
        return ticket;
    };

    const sendMessage = async (text, image) => {
        if (!text || !selectedTicket) return;
        const sent = await apiSendMessage(selectedTicket.id, { text, image });
        setSelectedTicket(prev => ({
            ...prev,
            messages: [...(prev.messages || []), sent]
        }));
        return sent;
    };

    return {
        tickets,
        selectedTicket,
        userOrders,
        loading,
        isStaff,
        loadOrders,
        selectTicket,
        createTicket,
        sendMessage,
        refreshTickets: loadTickets
    };
};