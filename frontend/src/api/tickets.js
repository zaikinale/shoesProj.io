import { BASE_OPTIONS, buildUrl } from '../utils/apiBase.js';

const BASE_URL = buildUrl('tickets');

export async function getTickets() {
    const response = await fetch(BASE_URL, {
        method: 'GET',
        ...BASE_OPTIONS
    });
    if (!response.ok) throw new Error('Failed to fetch tickets');
    return response.json();
}

export async function getTicketById(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'GET',
        ...BASE_OPTIONS
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch ticket');
    }
    return response.json();
}

/**
 * Создать новый тикет
 * @param {Object} data - { subject, category, orderId }
 */
export async function createTicket(data) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        ...BASE_OPTIONS,
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create ticket');
    }
    return response.json();
}

export async function closeTicket(id) {
    const response = await fetch(`${BASE_URL}/${id}/close`, {
        method: 'PATCH',
        ...BASE_OPTIONS
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to close ticket');
    }
    return response.json();
}

export async function sendMessage(ticketId, data) {
    const response = await fetch(`${BASE_URL}/${ticketId}/messages`, {
        method: 'POST',
        ...BASE_OPTIONS,
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send message');
    }
    return response.json();
}

export async function markAsRead(id) {
    const response = await fetch(`${BASE_URL}/${id}/read`, {
        method: 'PATCH',
        ...BASE_OPTIONS
    });
    
    if (!response.ok) {
        console.error('Failed to mark messages as read');
        return null;
    }
    
    return response.json();
}