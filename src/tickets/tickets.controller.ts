import { Controller, Get } from '@nestjs/common';
import { TicketsService } from './tickets.service.js';

@Controller('tickets')
export class TicketsController {

   constructor(private readonly ticketService: TicketsService){}

    @Get()
    findAll() {
        return this.ticketService.findAll();
    }
}
