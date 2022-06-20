import {Inject, Injectable, InjectionToken, Type} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {
  BracketCountdownTimeAction,
  CloseRoundAction,
  CurrentGameCountAction,
  DecryptQuestionSuccessAction,
  GoAction,
  JoinPrivateGameAction,
  LoadGameAction,
  LoadGameActualPayoutsAction,
  PlayPoolPlayAction,
  PlayPoolPlayFailAction,
  SetClientTimeDriftAction,
  ShowGameResultsDialogAction,
  SyncMessageReceivedAction, SyncMessagesReceivedAction
} from '@snowl/app-store/actions';
import {
  catchError,
  debounceTime,
  filter,
  map,
  mergeMap,
  pluck,
  startWith,
  switchMap,
  take,
  takeWhile,
  tap,
  throttleTime,
  withLatestFrom
} from 'rxjs/operators';
import {BaseGameplayService, JoinGameResponse} from '@snowl/base-app/shared/services/base-gameplay.service';
import {combineLatest, interval, merge, NEVER, of, timer} from 'rxjs';
import {Count, Game, SyncMessage, syncMessageFromJson} from '@snowl/base-app/model';
import {Action, select, Store} from '@ngrx/store';
import {AppState, SerializedRoute} from '@snowl/app-store/reducers';
import {
  getBracketCountdown,
  getClientTimeDrift,
  getCurrentGame,
  getCurrentGameClientState,
  getCurrentPlayerCount,
  getCurrentRound,
  getGameEntities,
  getGameLoading,
  getIsLoggedIn,
  getRouterState
} from '@snowl/app-store/selectors';
import {
  AnswerQuestionAction,
  JoinGameAction,
  JoinGameFailAction,
  JoinGameSuccessAction
} from '@snowl/app-store/actions/gameplay.actions';
import {BaseDialogService, BaseSocketService, DialogComponentResponse} from "@snowl/base-app/shared";
import {LogService} from "@snowl/base-app/shared/services/log.service";
import {TieBreakerComingAction} from "@snowl/app-store/actions/round.actions";
import {ROUTER_NAVIGATION, RouterNavigationAction} from '@ngrx/router-store';
import {BaseRoundComponent, confirmAndJoinGame} from '@snowl/base-app/game';
import {GameEffects} from '@snowl/app-store/effects/game.effects';
import {HttpErrorHandler} from '@snowl/base-app/error-handler';
import {elseMap, elseMapTo, resultMap, resultMergeMap} from 'ts-results/rxjs-operators';
import {getValue} from '@snowl/base-app/util';

export const GAME_RESULTS_DIALOG = new InjectionToken<Type<any>>('GAME_RESULTS_DIALOG');
export const ROUND_DIALOG = new InjectionToken<Type<BaseRoundComponent>>('ROUND_DIALOG');

@Injectable()
export class GameplayEffects {
  /**
   * Handles Joining a Game
   */
  @Effect()
  joinGame$ = this.actions$.pipe(
    ofType<JoinGameAction>(JoinGameAction.type),
    map(action => action.payload),
    tap(gameId => this.logger.log('Attempting to join game: ' + gameId)),
    mergeMap(gameId => this.gameplayService.joinGame(gameId)),
    resultMap(resp => new JoinGameSuccessAction(resp.gameId)),
    elseMap(err => new JoinGameFailAction(err)),
    tap(resp => this.logger.log('Got join game response: ', resp))
  );

  /**
   * Handles joining a private game
   */
  @Effect()
  joinPrivateGame$ = this.actions$.pipe(
    ofType<JoinPrivateGameAction>(JoinPrivateGameAction.type),
    map(action => action.payload),
    tap(code => this.logger.log('Attempting to join private game with code: ' + code)),
    mergeMap(code => this.gameplayService.joinPrivateGame(code)),
    resultMergeMap(resp => [new JoinGameSuccessAction(resp.gameId), new GoAction(['/game', resp.gameId])]),
    elseMap(err => new JoinGameFailAction(err)),
    tap(resp => this.logger.log('Got join game response: ', resp))
  );

  /**
   * Handles errors after joining a game
   */
  @Effect({dispatch: false})
  joinGameFail$ = this.actions$.pipe(
    ofType<JoinGameFailAction>(JoinGameFailAction.type),
    tap(action => {
      this.httpErrorHandler.handleError(action.payload, {
        accessDenied: 'Cannot play this game, Access Denied.',
        noOpenRounds: 'This game is full, and no more players can join.',
        gameNotOpen: 'Cannot join this game, the tournament has already started.',
        invalidParam: {
          message: 'Invalid invite code.',
          check: (err: JoinGameResponse) => {
            return err.message === 'inviteCode';
          }
        }

      }, 'An unexpected error occurred trying to join game.')
    })
  );

  /**
   * Handles the starting of playing pool rounds
   */
  @Effect()
  playPoolPlay$ = this.actions$.pipe(
    ofType<PlayPoolPlayAction>(PlayPoolPlayAction.type),
    throttleTime(5000),
    map(action => action.payload),
    mergeMap(gameId => this.gameplayService.beginPoolPlay(gameId)),

    // We only care about the result if it was an error.  Socket.io handles the success response here.
    resultMap(() => null, err => new PlayPoolPlayFailAction(err)),
    map(result => result.val),
    filter(result => !!result)
  );

  /**
   * Handles an error when trying to start playing pool play
   */
  @Effect({dispatch: false})
  playPoolPlayFail$ = this.actions$.pipe(
    ofType<PlayPoolPlayFailAction>(PlayPoolPlayFailAction.type),
    map(e => {
      this.httpErrorHandler.handleError(e.payload, {
        accessDenied: 'Cannot play this round, Access Denied.',
        noOpenRounds: 'This round is full, and no more players can play.'
      }, 'An unexpected error occurred trying to play.  Please try again later.');
    })
  );

  /**
   * Submits a player's answer
   */
  @Effect({dispatch: false})
  answerQuestion$ = this.actions$.pipe(
    ofType<AnswerQuestionAction>(AnswerQuestionAction.type),
    map(action => action.payload),
    mergeMap(({question, answer}) => {      
      return this.gameplayService.submitAnswer(question.subscriberQuestionAnswerId!, answer.id); // TODO: errors
    })
  );

  /**
   * Opens up the game results dialog
   */
  @Effect({dispatch: false})
  showGameResultsDialog$ = this.actions$.pipe(
    ofType<ShowGameResultsDialogAction>(ShowGameResultsDialogAction.type),
    pluck('payload'),
    tap((game) => {
      this.dialog.openComponent(this.gameResultsDialog, game);
    })
  );

  /**
   * Watches for the game_result sync message and pops open the game results dialog
   */
  @Effect()
  autoShowGameResults$ = this.actions$.pipe(
    ofType<SyncMessageReceivedAction>(SyncMessageReceivedAction.type),
    filter(action => action.payload.messageType === 'game_result'),
    map(() => getValue(this.store.pipe(select(getCurrentGame)))),
    map(game => new ShowGameResultsDialogAction(game!))
  );

  /**
   * Listens for the player_count socket.io message and brings down the player count
   */
  @Effect()
  playerCount$ = this.socketService.on<Count>('player_count').pipe(
    withLatestFrom(this.store.pipe(select(getCurrentPlayerCount))),
    // Only allow the player count to decrease.
    filter(([count, oldCount = Infinity]) => count.count < oldCount),
    map(([count]) => {
      return new CurrentGameCountAction(count.count)
    }),
    tap(action => this.logger.log('Recieved Player Count: ', action.payload))
  );

  /**
   * When on the tournament screen waits for the game to load and then sets the current player count
   */
  @Effect()
  playerCountNav$ = this.actions$.pipe(
    ofType<RouterNavigationAction<SerializedRoute>>(ROUTER_NAVIGATION),
    map(e => e.payload.routerState),
    switchMap((state) => {
      const onTournament = !!state && state.url.includes('/tournament');
      // While on the tournament screen wait for the game to load
      return onTournament ?
        this.store.pipe(
          select(getCurrentGame),
          filter((game): game is Game => !!game),
          take(1)
        ) : NEVER;
    }),
    map((game) => {
      let playerCount = game.totalPlayers;
      for (const round of game.rounds) {
        if (round.isBracketRound) {
          if (round.roundStatus === 'OPEN' || round.roundStatus === 'INPLAY' || round.roundStatus === 'CLOSED') {
            playerCount = round.currentPlayerCount;
          }
        }
      }
      return new CurrentGameCountAction(playerCount);
    })
  );

  /**
   * Handles the sync_messages from socket.io and calculates the client time drift
   */
  @Effect()
  syncMessage$ = this.socketService.on<SyncMessage>('sync_message').pipe(
    map(syncMessageFromJson),
    tap(message => this.logger.log('Received Sync Message From Socket.io: ', message)),
    mergeMap((message: SyncMessage) => {
      // Calculates the client time drift
      const oldDrift = getValue(this.store.pipe(select(getClientTimeDrift)));
      let drift = Date.now() - message.createDate.getTime();
      if (oldDrift) {
        drift = (drift + oldDrift) / 2;
      }

      // Ensure we've loaded the game.
      const games = getValue(this.store.pipe(select(getGameEntities)));
      if (!games[message.contextualId] || !games[message.contextualId].hasLoadedSyncMessages) {
        // Ignore the sync message for now, loading the game will bring it in again.
        return [new LoadGameAction(message.contextualId), new SetClientTimeDriftAction(drift)];
      }

      return [new SyncMessageReceivedAction(message), new SetClientTimeDriftAction(drift)];
    })
  );

  /**
   * Watches for the tiebreaker_coming socket.io message
   */
  @Effect()
  tieBreaker$ = this.socketService.on<Count<'tieBreakerComingInMs'>>('tiebreaker_coming').pipe(
    map(message => message.tieBreakerComingInMs),
    tap(time => this.logger.log(`Tie-breaker coming in ${time} seconds`)),
    map(time => new TieBreakerComingAction(time))
  );

  /**
   * While on the tournament screen continually checks
   * for the bracket countdown until the timer hits 0
   */
  @Effect()
  bracketCountdownTime$ = this.actions$.pipe(
    ofType<RouterNavigationAction<SerializedRoute>>(ROUTER_NAVIGATION),
    map(e => e.payload.routerState),
    switchMap((state) => {
      const isTournament = !!state && state.url.includes('/tournament');
      const tenSecs = 10000;
      // Refresh the countdown every 10 seconds until the timer hits 0
      return isTournament ? interval(tenSecs).pipe(
        startWith(0),
        takeWhile(() => getValue(this.store.pipe(select(getBracketCountdown))) !== 0)
      ) : NEVER;
    }),
    switchMap(() => this.store.pipe(select(getCurrentGame), filter((g): g is Game => !!g), take(1))),
    switchMap((game) => this.gameplayService.getBracketCountdownTime(game.id)),
    tap((time) => this.logger.log('Got Bracket Countdown Time: ' + time)),
    map(count => new BracketCountdownTimeAction(count))
  );

  /**
   * After we've received the bracket countdown wait until that time is up and then set the countdown time to 0
   */
  @Effect()
  finishBracketCountdown$ = this.actions$.pipe(
    ofType<BracketCountdownTimeAction>(BracketCountdownTimeAction.type),
    filter(action => !!action.payload),
    switchMap((action) => {
      // We are done counting down
      return timer(action.payload).pipe(map(() => new BracketCountdownTimeAction(0)));
    })
  );

  /**
   * After navigating away from the tournament screen we reset our bracket countdown to undefined
   */
  @Effect()
  clearBracketCountdownRouter$ = this.actions$.pipe(
    ofType<RouterNavigationAction<SerializedRoute>>(ROUTER_NAVIGATION),
    map(e => e.payload.routerState),
    filter(state => {
      const countdownTime = getValue(this.store.pipe(select(getBracketCountdown)));
      return countdownTime !== undefined && !!state && !state.url.includes('/tournament')
    }), // We have a countdown time but are no longer on the tournament screen
    map(() => new BracketCountdownTimeAction(undefined))
  );


  private decryptedQuestions: string[] = [];

  /**
   * Waits until we have a question, grabs the last encrypted question and decrypts it if we need to.
   */
  @Effect()
  decryptQuestion = this.store.pipe(select(getCurrentGameClientState)).pipe(
    filter(state => state === 'HAS_QUESTION'),
    map(() => getValue(this.store.pipe(select(getCurrentRound)))),
    filter(round => !!round),
    map(round => round.encryptedQuestions[round.encryptedQuestions.length - 1]),
    filter(message => this.decryptedQuestions.indexOf(message.id) === -1),
    tap(message => this.decryptedQuestions.push(message.id)),
    mergeMap(message => this.gameplayService.decryptQuestion(message)),
    tap(question => this.logger.log('Decrypted Question: ', question)),
    resultMap(question => new DecryptQuestionSuccessAction(question)),
    // TODO: Actually handle error!
    elseMapTo(null),
    filter(resp => !!resp)
  );

  /**
   * This watches for any round and countdown changes to see if we need to open the round dialog.
   */
  @Effect({dispatch: false})
  openRound$ = combineLatest(this.store.pipe(select(getCurrentRound)), this.store.pipe(select(getBracketCountdown))).pipe(
    debounceTime(100),
    tap(([currentRound, countdown]) => {
      const routerState = getValue(this.store.pipe(select(getRouterState)));
      const currentGame = getValue(this.store.pipe(select(getCurrentGame)));

      if (!currentRound)
        return; // We only care about opening the round dialog, not closing

      if (this.roundDialogId && this.roundDialogId !== currentRound.id) {
        // We have a dialog open for the wrong round, close it to reopen with a new one
        this.roundDialog!.close();
        this.roundDialog = this.roundDialogId = undefined;
      } else if (this.roundDialogId === currentRound.id) {
        return; // Don't reopen the round dialog.
      }

      if (!currentGame || !routerState.state) // These shouldn't ever happen
        return;
      const onTournament = routerState.state.url.includes('tournament');
      if (currentGame.gameStatus === 'INPLAY' && !onTournament)
        return; // We are about to be taken to the tournament screen
      if (onTournament && (countdown === undefined || countdown > 0))
        return; // We are either loading the countdown or have a countdown, don't show yet

      this.roundDialog = this.dialog.openComponent(this.roundDialogType, null);

      this.roundDialogId = currentRound.id;
    })
  );

  /**
   *  Watches for all game and router changes and loads the actual payout amounts for the game.
   *  Also reloads the game doc so that we have all of the rounds
   */
  @Effect()
  actualPayouts$ = combineLatest(
    this.store.pipe(select(getCurrentGame)),
    this.actions$.pipe(
      ofType<RouterNavigationAction<SerializedRoute>>(ROUTER_NAVIGATION),
      map(e => e.payload.routerState)
    )
  ).pipe(
    filter(([game, route]) => {
      if (!game || !game.userJoinedGame || game.actualPayout || game.loadingActualPayout)
        return false;
      else if (game.gameStatus === 'INPLAY')
        return true;
      else if (route.url.includes('/tournament'))
        return true;

      return  false;
    }),
    mergeMap(([game]) => {
      return [new LoadGameActualPayoutsAction(game!.id), new LoadGameAction(game!.id)];
    })
  );

  /**
   * Closes the round dialog
   */
  @Effect({dispatch: false})
  closeRound$ = this.actions$.pipe(
    ofType<CloseRoundAction>(CloseRoundAction.type),
    tap(action => {
      if (this.roundDialog) {
        this.roundDialog.close();
        this.roundDialog = this.roundDialogId = undefined;
      }
    })
  );

  private roundDialog?: DialogComponentResponse<any>;
  private roundDialogId?: string;

  constructor(
    private actions$: Actions,
    private gameplayService: BaseGameplayService,
    private store: Store<AppState>,
    private dialog: BaseDialogService,
    private logger: LogService,
    private socketService: BaseSocketService,
    private httpErrorHandler: HttpErrorHandler,
    private gameEffects: GameEffects,
    @Inject(GAME_RESULTS_DIALOG) private gameResultsDialog: Type<any>,
    @Inject(ROUND_DIALOG) private roundDialogType: Type<BaseRoundComponent>
  ) {
  }
}
