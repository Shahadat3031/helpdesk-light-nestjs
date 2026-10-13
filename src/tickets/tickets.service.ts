import { Injectable, NotFoundException } from '@nestjs/common';
import { Ticket } from './ticket.interface.js';

@Injectable()
export class TicketsService {

    private readonly tickets: Ticket[] = [
        {
            id: 1,
            subject: 'Cannot login to account',
            description: 'User can not login to the dashboard after login',
            priority: 'high',
            status: 'open',
            createdAt: '2026-10-01T10:00:00:000Z'
        },
        {
            id: 2,
            subject: 'Payment failed',
            description: 'Card payment failes at the checkout step',
            priority: 'medium',
            status: 'open',
            createdAt: '2026-10-01T13:30:00:000Z'
        },
        {
            id: 3,
            subject: 'Download not working',
            description: 'Invoice PDF download returns an empty file',
            priority: 'low',
            status: 'closed',
            createdAt: '2026-10-01T10:00:00:000Z'
        },
    ]

    private nextTicketId = 4;

    findAll(status?: Ticket['status'], priority?: Ticket['priority']) {

        let tickets = this.tickets;

        if (status) {
            tickets = tickets.filter((ticket) => ticket.status === status);
        }

        if (priority) {
            tickets = tickets.filter((tickets) => tickets.priority === priority)
        }

        return tickets;
    }

    findOne(id: number) {
        const ticket = this.tickets.find((ticket) => ticket.id === id);

        if (!ticket) {
            throw new NotFoundException(`Ticket with ID ${id} not found`);
        }

        return ticket;
    }

    create(payload: any) {
        const ticket: Ticket = {
            id: this.nextTicketId++,
            subject: payload.subject,
            description: payload.description,
            priority: payload.priority,
            status: 'open',
            createdAt: new Date().toISOString(),
        }

        this.tickets.push(ticket);

        return ticket;
    }

}
