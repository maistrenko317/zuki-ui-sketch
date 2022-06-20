import {
  getBracketCountdown,
  getCurrentGame,
  getCurrentPlayerCount,
  getSubscriber
} from '@snowl/app-store/selectors';
import {select, Store} from '@ngrx/store';
import {AppState} from '@snowl/app-store/reducers';
import {Injectable, OnDestroy, OnInit, Type} from '@angular/core';
import {getCurrentRound} from "@snowl/app-store/selectors/round.selectors";
import {takeUntil} from "rxjs/operators";
import {BaseDialogService} from "@snowl/base-app/shared";
import {merge, Subject, combineLatest} from "rxjs";
import {DialogComponentResponse} from "@snowl/base-app/shared/services/base-dialog.service";
import {BaseRoundComponent} from "@snowl/base-app/game/base-round.component";
import {OpenRoundAction} from "@snowl/app-store/actions";

@Injectable()
export abstract class BaseTournamentComponent {
  currentGame$ = this.store.pipe(select(getCurrentGame));
  currentPlayerCount$ = this.store.pipe(select(getCurrentPlayerCount));
  subscriber$ = this.store.pipe(select(getSubscriber));
  bracketCountTime$ = this.store.pipe(select(getBracketCountdown));

  constructor(protected store: Store<AppState>, protected dialog: BaseDialogService) {
  }

  viewRound(roundId: string): void {
    this.store.dispatch(new OpenRoundAction(roundId));
  }
}
