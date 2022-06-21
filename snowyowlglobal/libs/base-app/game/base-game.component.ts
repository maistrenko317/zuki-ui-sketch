import { Inject, Injectable, OnDestroy, OnInit, Type, ViewContainerRef } from '@angular/core';
import { AppState } from '@snowl/app-store/reducers';
import { Store, select } from '@ngrx/store';
import { Game, Subscriber } from '@snowl/base-app/model';
import {
  canNavigateBack,
  getCurrentGame,
  getCurrentPlayerCount,
  getGameLoading,
  getGamesLoading,
  getIsJoiningGame,
  getIsLoggedIn, getRouterState,
  getSubscriber
} from '@snowl/app-store/selectors';
import {
  BackAction,
  GoAction,
  JoinGameAction,
  LoadGameAction, LoadGamesAction,
  OpenRoundAction,
  PlayPoolPlayAction, ShowGameResultsDialogAction
} from '@snowl/app-store/actions';
import { getValue } from '@snowl/base-app/util';
import { filter, take, takeUntil, tap } from 'rxjs/operators';
import { Subscription ,  Subject ,  zip ,  timer } from 'rxjs';
import { BaseDialogService } from '@snowl/base-app/shared';
import { BaseRoundComponent } from '@snowl/base-app/game/base-round.component';
import { DialogComponentResponse } from '@snowl/base-app/shared/services/base-dialog.service';
import { getCurrentRound } from '@snowl/app-store/selectors/round.selectors';
import {DecimalPipe} from '@angular/common';
import {confirmAndJoinGame, createJoinGameOrPoolDialog, showShouldBeLoggedIn} from '@snowl/base-app/game/game-utils';

@Injectable()
export abstract class BaseGameComponent implements OnInit, OnDestroy {
  currentGame$ = this.store.pipe(select(getCurrentGame)).pipe(filter((game): game is Game => !!game));

  loading$ = this.store.pipe(select(getGameLoading));
  loggedIn$ = this.store.pipe(select(getIsLoggedIn));

  protected subscriber$ = this.store.pipe(select(getSubscriber));
  protected onDestroy = new Subject<void>();
  constructor(protected store: Store<AppState>, protected dialog: BaseDialogService) {}

  ngOnInit(): void {
    // this.currentRound$.pipe(takeUntil(this.onDestroy)).subscribe(round => {
    //   const routerState = getValue(this.routerState$);
    //   if (routerState.state && routerState.state.url.includes('tournament')) {
    //     // On mobile devices both the tournament and game component will be open.  Don't open the round component twice
    //     return;
    //   }
    //
    //   if (round && !this.roundDialog) {
    //     if (round.isBracketRound && !round.finished) {
    //       this.goToTournament();
    //       return;
    //     }
    //
    //     this.roundDialog = this.dialog.openComponent({ component: this.roundComponent, options: {fullscreen: true} });
    //     this.roundDialog.onClose.subscribe(() => {
    //       this.roundDialog = undefined;
    //     });
    //   } else if (!round && this.roundDialog) {
    //     this.roundDialog.close();
    //     this.roundDialog = undefined;
    //   }
    // });
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  refresh(callback: () => void): void {
    const gameId = getValue(this.currentGame$)!.id;
    const refreshed$ = this.loading$.pipe(filter(loading => !loading), take(1));
    zip(refreshed$, timer(1000)).subscribe(() => callback());
    this.store.dispatch(new LoadGameAction(gameId));
  }

  goBack(): void {
    this.store.dispatch(new BackAction('/home/games'));
  }

  joinGame(): void {
    const game = getValue(this.currentGame$);
    this.dialog.open<'pool' | 'join'>({
      content: createJoinGameOrPoolDialog(game),
      buttons: []
    }).onClose.subscribe((val: 'pool' | 'join') => {
      if (val === 'pool') {
        this.store.dispatch(new PlayPoolPlayAction(game.id));
      } else if (val === 'join') {
        confirmAndJoinGame(game, this.store, this.dialog);
      }
    });
  }

  viewResults(): void {
    // TODO: Why in the world do we dispatch a loadGamesAction?;
    // this.store.dispatch(new LoadGamesAction());
    setTimeout(() => {
      const game = getValue(this.currentGame$)!;
      this.store.dispatch(new ShowGameResultsDialogAction(game));
    });
  }

  playNextRound(): void {
    if (getValue(this.loggedIn$)) {
      const id = getValue(this.currentGame$)!.id;
      this.store.dispatch(new PlayPoolPlayAction(id));
    } else {
      showShouldBeLoggedIn(this.dialog, this.store);
    }
  }

  viewRound(round: string): void {
    this.store.dispatch(new OpenRoundAction(round));
  }

  private goToTournament(): void {
    const gameId = getValue(this.currentGame$)!.id;
    this.store.dispatch(new GoAction(['/game', gameId, 'tournament']));
  }
}
