import {Injectable} from '@angular/core';
import {AppState, SignupForm} from '../reducers';
import {getLocalStorage, getRouterHistory, getSignupForm} from '../selectors';
import {select, Store} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {catchError, filter, map, mergeMap, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {BaseSubscriberService} from '@snowl/base-app/shared/services/base-subscriber.service';
import * as actions from '../actions/auth.actions';
import {CheckingNicknameAction, CheckingNicknameResponseAction} from '../actions/auth.actions';
import {
  BackAction, ClearLocalStorageAction,
  GoAction,
  LoadSubscriberAction,
  LoadSubscriberFailAction,
  LoadSubscriberSuccessAction,
  LoginFailedAction,
  RemoveLocalStorageAction,
  SetLocalStorageAction,
  SignupFailedAction, SyncMessageReceivedAction
} from '@snowl/app-store/actions';
import {BehaviorSubject, NEVER, of, timer} from 'rxjs';
import {fillSubscriberFromJson, GameResultSyncMessage} from '@snowl/base-app/model';
import {LocalStorageState} from '@snowl/app-store/reducers';
import {BaseDialogService, BaseSocketService} from '@snowl/base-app/shared';
import {LogService} from "@snowl/base-app/shared/services/log.service";
import {HttpErrorHandler} from '@snowl/base-app/error-handler';
import {getValue, randomInt} from '@snowl/base-app/util';
import {elseMap, resultMap, resultMergeMap} from 'ts-results/rxjs-operators';

@Injectable()
export class AuthEffects {
  @Effect()
  login$ = this.actions$.pipe(
    ofType<actions.LoginAction>(actions.LoginAction.type),
    mergeMap(login => this.subscriberService.login(login.email, login.password)),
    resultMergeMap(({sessionKey, subscriber})=> {
        this.logService.log('Successfully logged in!');
        return [new SetLocalStorageAction({sessionKey, subscriber: JSON.stringify(subscriber)}), new BackAction('/home/games')];
    }),
    elseMap(err => new LoginFailedAction(err))
  );

  @Effect({dispatch: false})
  loginError = this.actions$.pipe(
    ofType<actions.LoginFailedAction>(actions.LoginFailedAction.type),
    tap(action => {
      this.dialog.closeLoadingIndicator();
      this.httpErrorHandler.handleError(action.payload, {
        accountDeactivated: 'Your account has been deactivated.  Please contact us for more information.',
        invalidLogin: 'Invalid email or password.',
        passwordChangeRequired: 'Your account requires a password reset.  Please contact us for more information.'
      }, 'An unexpected error occurred while logging in.  Please try again later.');
    })
  );

  @Effect()
  signup = this.actions$.pipe(
    ofType<actions.SignupAction>(actions.SignupAction.type),
    withLatestFrom(this.store.pipe(select(getSignupForm))),
    map(([action, form]) => form),
    mergeMap((form: SignupForm) => this.subscriberService.signup(form)),
    resultMergeMap(({sessionKey, subscriber}) => {
      // Try to find the latest in the router history
      let history = getValue(this.store.pipe(select(getRouterHistory)));
      history = history.filter(url => !url.includes('auth')); // strip all of the login/signup paths from history

      const goBackTo = history.length ? history[history.length - 1] : '/home/games';

      return [new SetLocalStorageAction({sessionKey, subscriber: JSON.stringify(subscriber)}), undefined,
        new GoAction([goBackTo], {clearHistory: true, animated: true, transition: {name: 'slideRight'}})];
    }),
    elseMap(err => new SignupFailedAction(err))
  );

  @Effect({dispatch: false})
  signupFailed = this.actions$.pipe(
    ofType<actions.SignupFailedAction>(actions.SignupFailedAction.type),
    tap(action => {
      this.httpErrorHandler.handleError(action.payload, {
        nicknameAlreadyUsed: 'That nickname has already been used.',
        emailAlreadyUsed: 'That email has already been used.',
        nicknameInvalid: 'That nickname has already been used.' // TODO: what does this mean?
      }, 'An unexpected error occurred while signing up.  Please try again later.')
    })
  );

  @Effect()
  loadSubscriber = this.actions$.pipe(
    ofType<actions.LoadSubscriberAction>(actions.LoadSubscriberAction.type),
    mergeMap(action => this.subscriberService.loadSubscriber()),
    resultMergeMap(sub => {
      return [
        new LoadSubscriberSuccessAction(sub),
        new SetLocalStorageAction({subscriber: JSON.stringify(sub)})
      ]
    }),
    elseMap(err => {
      return new LoadSubscriberFailAction(err)
    })
  );

  @Effect({dispatch: false})
  loadSubscriberFail = this.actions$.pipe(
    ofType<actions.LoadSubscriberFailAction>(actions.LoadSubscriberFailAction.type),
    tap(action => {
      this.httpErrorHandler.handleError(action.payload, {}, 'An unexpected error occurred trying to load subscriber.  Please try again later.');
    })
  );

  @Effect({dispatch: false})
  connectSocketService = this.actions$.pipe(
    ofType<actions.LoadSubscriberSuccessAction>(actions.LoadSubscriberSuccessAction.type),
    tap(action => {
      this.socketService.connect(action.payload.primaryIdHash);
    })
  );

  // TODO: Why is this in the auth effects?
  @Effect()
  loadSubscriberGames = this.actions$.pipe(
    ofType<actions.LoadSubscriberSuccessAction>(actions.LoadSubscriberSuccessAction.type),
    mergeMap(action => {
      return this.subscriberService
        .loadSubscriberGames(action.payload)
        .pipe(
          map(games => new actions.LoadSubscriberGamesSuccessAction(games)),
          catchError(err => of(new actions.LoadSubscriberGamesFailAction(err)))
        );
    })
  );

  @Effect({dispatch: false})
  loadSubscriberGamesFail = this.actions$.pipe(
    ofType<actions.LoadSubscriberGamesFailAction>(actions.LoadSubscriberGamesFailAction.type),
    tap(action => {
      this.httpErrorHandler.handleError(action.payload, {}, 'An unexpected error occurred trying to load subscriber games.  Please try again later.');
    })
  );

  @Effect()
  checkUsername$ = this.actions$.pipe(
    ofType<actions.UpdateSignupFormAction>(actions.UpdateSignupFormAction.type),
    map(action => action.payload.nickname),
    filter(nickname => !!nickname),
    switchMap(nickname => {
      this.store.dispatch(new CheckingNicknameAction());
      return this.subscriberService.checkNickname(nickname!);
    }),
    map(resp => new CheckingNicknameResponseAction(resp))
  );
  private authenticatedPauser = new BehaviorSubject(false);
  @Effect()
  userAuthenticatedChecker = this.authenticatedPauser.pipe(
    switchMap(paused => (paused ? NEVER : this.store.pipe(select(getLocalStorage)))),
    filter((ls: LocalStorageState) => !!ls.sessionKey && !!ls.subscriber),
    map(localStorage => {
      const subscriber = fillSubscriberFromJson(JSON.parse(localStorage.subscriber!));
      return new actions.UserAuthenticatedAction([localStorage.sessionKey!, subscriber]);
    })
  );
  @Effect()
  userAuthenticated = this.actions$.pipe(
    ofType<actions.UserAuthenticatedAction>(actions.UserAuthenticatedAction.type),
    map(action => {
      this.authenticatedPauser.next(true);
      return new LoadSubscriberAction();
    })
  );
  @Effect()
  logout = this.actions$.pipe(
    ofType<actions.LogoutAction>(actions.LogoutAction.type),
    mergeMap(() => {
      this.socketService.disconnect();
      this.authenticatedPauser.next(false);
      return [new ClearLocalStorageAction(['deviceId', 'referralNickname']), new BackAction('/home/me')];
    })
  );

  @Effect()
  wonMoney$ = this.actions$.pipe(
    ofType<SyncMessageReceivedAction>(SyncMessageReceivedAction.type),
    map(action => action.payload),
    filter((message): message is GameResultSyncMessage => message.messageType === 'game_result'),
    filter((message) => !!message.payload.gamePlayer.payoutAwardedAmount),
    switchMap(() => timer(randomInt(100, 2000))), // Wait some amount of time before doing this so we don't all hit the server at the same time
    map(() => new LoadSubscriberAction()) // Reload the subscriber after having won money
  );

  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    private subscriberService: BaseSubscriberService,
    private socketService: BaseSocketService,
    private httpErrorHandler: HttpErrorHandler,
    private dialog: BaseDialogService,
    private logService: LogService
  ) {
  }
}
