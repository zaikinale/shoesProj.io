import { prisma } from '../utils/prismaClient';

export class TicketService {
    static async getAll(userId: number, isStaff: boolean) {
        return prisma.ticket.findMany({
            where: isStaff ? {} : { userId },
            include: {
                user: { select: { username: true } },
                _count: { 
                    select: { 
                        messages: { 
                            where: { 
                                authorId: { not: userId }, 
                                viewed: false 
                            } 
                        } 
                    } 
                }
            },
            orderBy: { updatedAt: 'desc' }
        });
    }
    
    static async getById(id: number, userId: number, isStaff: boolean) {
        const ticket = await prisma.ticket.findUnique({
            where: { id },
            include: {
                messages: {
                    include: { author: { select: { username: true, roleID: true } } },
                    orderBy: { createdAt: 'asc' }
                },
                order: true 
            }
        });

        if (!ticket) throw new Error('NOT_FOUND');
        if (ticket.userId !== userId && !isStaff) throw new Error('FORBIDDEN');

        this.markAsRead(id, userId).catch(err => 
            console.error("Ошибка при обновлении статуса прочтения:", err)
        );

        return ticket;
    }

    static async create(userId: number, data: { subject: string, category: string, orderId?: number }) {
        const { subject, category, orderId } = data;
        return prisma.ticket.create({
            data: {
                subject,
                category,
                userId,
                orderId: orderId || null,
                status: 'open'
            }
        });
    }

    static async addMessage(ticketId: number, userId: number, isStaff: boolean, data: { text: string, image?: string }) {
        const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
        if (!ticket) throw new Error('NOT_FOUND');
        if (ticket.userId !== userId && !isStaff) throw new Error('FORBIDDEN');

        return prisma.$transaction(async (tx) => {
            const message = await tx.message.create({
                data: {
                    text: data.text,
                    image: data.image || null,
                    ticketId,
                    authorId: userId
                },
                include: { author: { select: { username: true, roleID: true } } }
            });

            await tx.ticket.update({
                where: { id: ticketId },
                data: { updatedAt: new Date() }
            });

            return message;
        });
    }
    
    static async markAsRead(ticketId: number, userId: number) {
        return await prisma.message.updateMany({
            where: {
                ticketId,
                authorId: { not: userId },
                viewed: false
            },
            data: {
                viewed: true
            }
        });
    }

    static async close(id: number, userId: number, isStaff: boolean) {
        const ticket = await prisma.ticket.findUnique({ where: { id } });
        if (!ticket) throw new Error('NOT_FOUND');
        if (ticket.userId !== userId && !isStaff) throw new Error('FORBIDDEN');

        return prisma.ticket.update({
            where: { id },
            data: { status: 'closed' }
        });
    }
}