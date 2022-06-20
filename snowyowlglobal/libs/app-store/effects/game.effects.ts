import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {
  catchError,
  debounceTime,
  filter,
  map,
  mapTo,
  mergeMap,
  switchMap, take,
  takeWhile, tap,
  withLatestFrom
} from 'rxjs/operators';
import {
  LoadGameActualPayoutsAction, LoadGameActualPayoutsSuccessAction,
  LoadGamePayoutsAction, LoadGamePayoutsSuccessAction,
  LoadGamesAction,
  LoadGamesFailAction,
  LoadGamesSuccessAction,
  SetLocalStorageAction, SyncMessageReceivedAction,
} from '../actions';
import {BaseGameService} from '@snowl/base-app/shared/services/base-game.service';
import {
  BackAction,
  CloseRoundAction,
  GoAction,
  LoadGameAction,
  LoadGameFailAction,
  LoadGameSuccessAction,
  OpenRoundAction
} from '@snowl/app-store/actions';
import {AppState, SerializedRoute} from '@snowl/app-store/reducers';
import {ROUTER_NAVIGATION, RouterNavigationAction} from '@ngrx/router-store';
import {select, Store} from '@ngrx/store';
import {
  getAllGames,
  getCurrentGame,
  getCurrentGameClientState,
  getCurrentRoundId,
  getGameEntities,
  getIsLoggedIn, getLocalStorage,
  getRouterState,
  getSentFreeplayNotifications
} from '@snowl/app-store/selectors';
import {interval, NEVER, of, merge, zip} from 'rxjs';
import {LoadRoundsSuccessAction} from '@snowl/app-store/actions/round.actions';
import {SyncMessagesReceivedAction} from '@snowl/app-store/actions/sync-message.actions';
import {BaseDialogService} from "@snowl/base-app/shared";
import {NormalizedGame} from "@snowl/base-app/model";
import {LogService} from "@snowl/base-app/shared/services/log.service";
import {getValue} from '@snowl/base-app/util';
import {confirmAndJoinGame} from '@snowl/base-app/game';

@Injectable()
export class GameEffects {
  // Sends a stream of games as they are changed by sync messages
  public gameChanges$ = merge(
    this.actions$.pipe(
      ofType<SyncMessagesReceivedAction>(SyncMessagesReceivedAction.type),
      debounceTime(300),
      mergeMap(() => {
        return getValue(this.store.pipe(select(getAllGames)));
      })
    ),
    this.actions$.pipe(
      ofType<SyncMessageReceivedAction>(SyncMessageReceivedAction.type),
      map(action => {
        const games = getValue(this.store.pipe(select(getGameEntities)));
        return games[action.payload.contextualId];
      }),
      filter(game => !!game)
    )
  );

  @Effect()
  loadGames$ = this.actions$.pipe(
    ofType<LoadGamesAction>(LoadGamesAction.type),
    mergeMap(() => {
      return zip(this.gameService.loadGames(), this.gameService.loadAllSyncMessages()).pipe(
        switchMap(([resp, syncMessagesResult]) => {
          return [
            new LoadGamesSuccessAction(resp.games),
            new LoadRoundsSuccessAction(resp.rounds),
            new SyncMessagesReceivedAction(syncMessagesResult.unwrap())
          ];
        }),
        catchError((err) => {
          return of(new LoadGamesFailAction(err)) // TODO: Handle error
        })
      )
    })
  );

  /**
   * Loads the game when we navigate to the game page
   */
  @Effect()
  gameNavigation$ = this.actions$.pipe(
    ofType<RouterNavigationAction<SerializedRoute>>(ROUTER_NAVIGATION),
    map(e => e.payload.routerState),
    filter(state => state.params.hasOwnProperty('gameId')), // the route has the game component
    map(state => state.params.gameId), // get the game id
    withLatestFrom(this.store.pipe(select(getGameEntities))), // get all the games
    filter(([id, entities]) => !entities[id] || !entities[id].hasLoadedSyncMessages), // Make sure we haven't loaded the game already
    map(([id]) => new LoadGameAction(id)) // we don't have the game, load it
  );

  /**
   * While on the game page reload the game every 5 seconds if the game is
   * open or pending. (To check for the transition to open or inplay)
   */
  @Effect()
  gameReload$ = this.actions$.pipe(
    ofType<RouterNavigationAction<SerializedRoute>>(ROUTER_NAVIGATION),
    map(e => e.payload.routerState),
    switchMap(state => {
      const onGameRoute = state.params.hasOwnProperty('gameId');
      const gameId = state.params.gameId;

      return onGameRoute ?
        interval(5000).pipe( // Every 5 seconds
          takeWhile(() => {
            const game = getValue(this.store.pipe(select(getCurrentGame)));
            // while we don't have the game or the game is OPEN or PENDING
            return !game || (game.gameStatus === 'OPEN' || game.gameStatus === 'PENDING');
          }),
          filter(() => {
            // Don't reload while in the middle of a round
            const currentRound = getValue(this.store.pipe(select(getCurrentRoundId)));
            return !currentRound;
          }),
          mapTo(gameId)
        ) : NEVER;
    }),
    map(id => new LoadGameAction(id)) // reload the game
  );

  /**
   * Handles loading of individual games
   */
  @Effect()
  loadGame$ = this.actions$.pipe(
    ofType<LoadGameAction>(LoadGameAction.type),
    mergeMap(action => {
      return zip(this.gameService.getGameById(action.payload), this.gameService.loadSyncMessagesForGame(action.payload)).pipe(
        mergeMap(([resp, syncMessagesResult]) => {
          resp.game.hasLoadedSyncMessages = true;

          return [
            new LoadRoundsSuccessAction(resp.rounds),
            new LoadGameSuccessAction(resp.game),
            new SyncMessagesReceivedAction({[resp.game.id]: syncMessagesResult.unwrap()})
          ];
        }),
        catchError((err) => of(new LoadGameFailAction(err)))
      );
    })
  );

  /**
   * When we fail to load a game by an id take us back to the games list
   */
  @Effect()
  loadGameFail = this.actions$.pipe(
    ofType<LoadGameFailAction>(LoadGameFailAction.type),
    // TODO: should I verify which type of error this is or assume that the url was a bad game id?
    map(() => new BackAction('/home/games'))
  );

  /**
   * Handles loading of game payouts
   */
  @Effect()
  loadGamePayouts$ = this.actions$.pipe(
    ofType<LoadGamePayoutsAction>(LoadGamePayoutsAction.type),
    mergeMap((action) => {
      return this.gameService.loadGamePayouts(action.payload).pipe(
        map(resp => new LoadGamePayoutsSuccessAction(resp, action.payload)),
        catchError(() => NEVER) // TODO: Handle
      )
    })
  );

  /**
   * Handles loading the game actual payouts
   */
  @Effect()
  loadGameActualPayouts$ = this.actions$.pipe(
    ofType<LoadGameActualPayoutsAction>(LoadGameActualPayoutsAction.type),
    mergeMap((action) => {
      return this.gameService.loadGameActualPayouts(action.payload).pipe(
        map(resp => new LoadGameActualPayoutsSuccessAction(resp, action.payload)),
        catchError(() => NEVER) // TODO: Handle
      )
    })
  );

  /**
   * Watches the client state to either open or close the round dialog
   */
  @Effect()
  gameStateRound$ = this.store.pipe(select(getCurrentGameClientState)).pipe(
    withLatestFrom(this.store.pipe(select(getCurrentRoundId)), this.store.pipe(select(getCurrentGame))),
    switchMap<any, any>(([state, id, game]) => {
      if (!game)
        return NEVER;

      if (state === 'DEFAULT' && id) {
        return [new CloseRoundAction()];
      } else if (state !== 'DEFAULT' && game.currentRound && id !== game.currentRound) {
        return [new OpenRoundAction(game.currentRound)];
      } else {
        return NEVER;
      }
    })
  );

  /**
   * This is an ugly one.  Watches for all of the game changes as they go by
   * and checks if one of the games is started and if so takes you there.
   */
  @Effect()
  shouldGoToTournament$ = this.gameChanges$.pipe(
    withLatestFrom(this.store.pipe(select(getRouterState))),
    filter(([game, routerState]) => !!routerState.state),
    mergeMap(([game, routerState]) => {
      // If we are already showing the dialog cancel.
      if (this.showingGameStartedDialog)
        return NEVER;

      // Make sure we have joined the game and it is inplay
      if (game.gameStatus !== 'INPLAY' || !game.userJoinedGame) {
        return NEVER;
      }

      const url: string = routerState.state!.url;
      if (url !== `/game/${game.id}/tournament`) {
        this.showingGameStartedDialog = true;

        const dialog = this.dialog.open({
          title: 'Tournament has started!',
          message: `The tournament for game "${game.gameNames.en}" has started! Taking you there now.`,
          buttons: ['Ok']
        });

        setTimeout(() => dialog.close(), 4000);

        return dialog.onClose.pipe(tap(() => this.showingGameStartedDialog = false),
          map(() => new GoAction(['/game', game!.id, 'tournament']))
        );
      } else {
        return NEVER;
      }
    })
  );

  /**
   * This navigates away from the tournament screen and logs an error if:
   * a) The user isn't logged in
   * b) The tournament hasn't started
   * c) The user never joined the tournament
   */
  @Effect()
  shouldLeaveTournament$ = this.actions$.pipe(
    ofType<RouterNavigationAction<SerializedRoute>>(ROUTER_NAVIGATION),
    map(e => e.payload.routerState),
    switchMap(state => {
      const gameId = state.params.gameId;
      const onTournament = state.url.includes('tournament');

      // While on the tournament screen check the conditions
      return onTournament ? merge(
        // We aren't logged in
        this.store.pipe(
          select(getLocalStorage),
          filter(storage => !!storage.deviceId && !storage.sessionKey),
          mapTo([gameId, 'Not Logged In'])
        ),
        // The tournament hasn't started
        this.store.pipe(
          select(getCurrentGame),
          filter(game => !!game && game.gameStatus === 'OPEN'),
          mapTo([gameId, 'Game Not Started'])
        ),
        // The user hasn't joined the game
        this.store.pipe(
          select(getCurrentGame),
          filter(game => !!game && game.hasParsedSyncMessages && !game.userJoinedGame),
          mapTo([gameId, 'Not In Game'])
        )
      ).pipe(take(1)) : NEVER;
    }),
    map(([gameId, reason]) => {
      this.logger.error(`Navigated Away From The tournament for game: ${gameId}. Reason: ${reason}`);
      return new BackAction('/home/games');
    })
  );

  /**
   *  After we've loaded our games checks to see if one of the games
   *  should notify us (being freeplayers) and then notifies.
   */
  @Effect()
  showFreeplayNotification$ = this.actions$.pipe(
    ofType(LoadGamesAction.type),
    filter(() => getValue(this.store.pipe(select(getIsLoggedIn)))),
    map(() => {
      const games = getValue(this.store.pipe(select(getAllGames)));
      const shownFreeplayNotificationsLS = getValue(this.store.pipe(select(getSentFreeplayNotifications))) || '';
      const shownFreeplayNotifications: string[] = shownFreeplayNotificationsLS.split(',');
      const newLS: string[] = [];
      let shownNotificationAlready = false;

      games.forEach(game => {
        if (game.extras.freeplayNotificationSent) {
          const contains = shownFreeplayNotifications.indexOf(game.id) !== -1;
          if (!contains && !shownNotificationAlready && !game.userJoinedGame && game.userJoinedFreeplay) {
            shownNotificationAlready = true;
            newLS.push(game.id);
            this.dialog.open({
              title: 'Join Game?',
              message: `The game "${game.gameNames.en}" is about to start and you have not yet joined the game. Would you like to do so?`,
              buttons: ['Join Game', 'Not Now']
            }).onClose.subscribe(val => {
              if (val === 'Join Game') {
                confirmAndJoinGame(game, this.store, this.dialog).subscribe(joined => {
                  if (joined) {
                    this.store.dispatch(new GoAction(['/game', game.id]));
                  }
                });
              }
            });
          } else if (contains) {
            newLS.push(game.id);
          }
        }
      });

      return new SetLocalStorageAction({
        sentFreeplayNotifications: newLS.join(',')
      });
    })
  );

  private showingGameStartedDialog = false;
  constructor(
    private gameService: BaseGameService,
    private actions$: Actions,
    private logger: LogService,
    private store: Store<AppState>,
    private dialog: BaseDialogService
  ) {
  }
}
