import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { map } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { Ticket, TicketComment } from '@tuskdesk-suite/data-models';
import { LoadTicket, PartialAppState, ticketsQuery } from '@tuskdesk-suite/tickets-state';
import { TicketTimerService } from '../ticket-timer.service';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketDetailsComponent implements OnInit {
  ticket$: Observable<Ticket>;
  comments$: Observable<TicketComment[]>;
  ticketMessage = new FormControl();
  timer$: Observable<number>;
  markedToWork$: Observable<boolean>;

  constructor(
    private store: Store<PartialAppState>,
    private route: ActivatedRoute,
    private ticketTimerService: TicketTimerService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.markedToWork$ = this.ticketTimerService.ticketsToWork$.pipe(
        map(tickets => {
          return tickets.indexOf(id) !== -1;
        })
      );

      this.ticket$ = this.store.pipe(
        select(ticketsQuery.getAllTickets),
        map(tickets => tickets.find(ticket => ticket.id === id))
      );

      this.store.dispatch(new LoadTicket(id));
    });
  }

  switchToEdit() {}

  cancelEdit() {}

  saveEdit() {}

  startTimer() {
    this.timer$ = this.ticketTimerService.timer$;
  }

  markToWork(ticketId: number) {
    this.ticketTimerService.addTicketToWork(ticketId);
  }
}
