import { Injectable } from '@nestjs/common';

@Injectable()
export class TicketsService {
    
    private readonly tickets = [
        {id:1, subject: 'Cannot Login'},
        {id:2, subject: 'Payment Failed'}
    ];

    findAll(){
        return this.tickets;
    }

}
