import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from "@ngrx/effects";
import {
  CloseRoundAction,
  GoAction,
  InviteFriendsAction,
  JoinGameSuccessAction,
  LogoutAction, PlayPoolPlayAction,
  UserAuthenticatedAction
} from "@snowl/app-store/actions";
import {BaseDialogService, BaseNotificationService, DialogContent} from "@snowl/base-app/shared";
import {debounceTime, filter, map, switchMap, take, tap} from "rxjs/operators";
import {select, Store} from '@ngrx/store';
import {AppState, SerializedRoute} from '@snowl/app-store/reducers';
import {formatNumber, getNextRound, getValue} from '@snowl/base-app/util';
import {
  getCurrentGame,
  getGameEntities,
  getGameLoading,
  getIsLoggedIn,
  getSubscriber
} from '@snowl/app-store/selectors';
import {merge} from 'rxjs';
import {formatRelative} from "date-fns";
import {confirmAndJoinGame, createJoinGameOrPoolDialog} from '@snowl/base-app/game';
import {ROUTER_NAVIGATION, RouterNavigationAction} from '@ngrx/router-store';
import {Game} from '@snowl/base-app/model';

@Injectable()
export class NotificationEffects {
  @Effect({dispatch: false})
  registerPush$ = this.actions$.pipe(
    ofType(UserAuthenticatedAction.type),
    tap(() => {
      this.notifications.registerForPush();
    })
  );

  @Effect({dispatch: false})
  deregisterPush$ = this.actions$.pipe(
    ofType(LogoutAction.type),
    tap(() => {
      this.notifications.deregisterForPush();
    })
  );

  /**
   * After joining the game shows the success dialog and then possibly the notification preference dialog
   */
  @Effect({dispatch: false})
  afterJoin$ = this.actions$.pipe(
    ofType<JoinGameSuccessAction>(JoinGameSuccessAction.type),
    switchMap((action) => {
      return this.store.pipe(
        select(getGameEntities),
        map(entities => entities[action.gameId]),
        filter(game => !!game), // Wait until we have the game, in the case of joining private games we won't have it yet.
        take(1)
        );
    }),
    switchMap((game) => {

      return this.dialog.open({
        title: 'Success!',
        content: [
          new DialogContent('text', {
            text: 'Congrats on joining the game!',
            fontSize: 16,
            center: true
          }),
          new DialogContent('text', {
            fontSize: 16,
            mTop: 10,
            spans: [
              new DialogContent('text', {
                text: 'Be here ready to play'
              }),
              new DialogContent('text', {
                text: formatRelative(game.expectedStartDateForBracketPlay, new Date()),
                bolded: true
              })
            ]
          }),
        ],
        buttons: ['Dismiss']
      }).onClose;
    }),
    filter(() => {
      const subscriber = getValue(this.store.pipe(select(getSubscriber)));
      return !!subscriber && subscriber.notificationPreference === "NOT_SET";
    }),
    switchMap(() => {
      return this.dialog.open({
        title: 'Notifications Preferences',
        message: `You have not yet set your notification preferences. If you are not notified about a game starting and you are not there to play you may lose money.`,
        buttons: ['Ok']
      }).onClose;
    }),
    tap(() => {
      this.store.dispatch(new GoAction(['/user/notifications']));
    })
  );

  /**
   * Watches for when we close the round dialog or go to the game screen,
   * then waits for the game to load and pops up tutorials if needed.
   */
  @Effect({dispatch: false})
  tutorial$ = merge(
    this.actions$.pipe(ofType<CloseRoundAction>(CloseRoundAction.type)),
    this.actions$.pipe(
      ofType<RouterNavigationAction<SerializedRoute>>(ROUTER_NAVIGATION),
      map(e => e.payload.routerState),
      filter(state => !!state && state.url.includes('/game') && !state.url.includes('/tournament'))
    )
  ).pipe(
    filter(() => getValue(this.store.pipe(select(getIsLoggedIn)))), // Ensure they are logged in
    switchMap(() => this.store.pipe(select(getGameLoading), filter(loading => !loading), take(1))), // Wait until we aren't loading the game
    switchMap(() => this.store.pipe(
      select(getCurrentGame),
      filter((game): game is Game => !!game), // Get the current game
      debounceTime(500), // Wait a sec
      take(1)
    )),
    tap(game => {
      const nextRound = getNextRound(game);
      if (nextRound || !game.userJoinedGame) {
        this.dialog.open<'pool' | 'join'>({
          content: createJoinGameOrPoolDialog(game),
          buttons: []
        }).onClose.subscribe((val: 'pool' | 'join') => {
          if (val === 'pool') {
            this.store.dispatch(new PlayPoolPlayAction(game.id));
          } else if (val === 'join') {
            confirmAndJoinGame(game, this.store, this.dialog);
          }
        })
      }
    })
  );


  constructor(private actions$: Actions, private store: Store<AppState>, private notifications: BaseNotificationService, private dialog: BaseDialogService) {

  }
}
