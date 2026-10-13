import { Controller, Get, Param, ParseIntPipe, Query, Post, Body } from '@nestjs/common';
import { TicketsService } from './tickets.service.js';
import { Ticket } from './ticket.interface.js';

@Controller('tickets')
export class TicketsController {

    constructor(private readonly ticketService: TicketsService) { }

    @Get()
    findAll(@Query('status') status?: Ticket['status'], @Query('priority') priority?: Ticket['priority']) {
        return this.ticketService.findAll(status, priority);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.ticketService.findOne(id);
    }

    @Post()
    create(@Body() payload: any){
        return this.ticketService.create(payload);
    }
}
