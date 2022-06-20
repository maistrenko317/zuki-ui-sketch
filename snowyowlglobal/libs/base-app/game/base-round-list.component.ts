import { Game, Round } from '@snowl/base-app/model';
import { EventEmitter, Injectable, Input, Output } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '@snowl/app-store/reducers';
import { getSubscriber } from '@snowl/app-store/selectors';

@Injectable()
export abstract class BaseRoundListComponent {
  @Output() viewRound = new EventEmitter<string>();

  @Input()
  game: Game;

  subscriber$ = this.store.pipe(select(getSubscriber));

  constructor(protected store: Store<AppState>) {}


  roundClicked(round: Round): void {
    if (round.finished) {
      this.viewRound.emit(round.id);
    }
  }

  trackByRound(round: Round): string {
    return round.id;
  }
}
