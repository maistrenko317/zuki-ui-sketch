import {Action} from '@ngrx/store';
import {Game, NormalizedGame, Subscriber} from '@snowl/base-app/model';
import {SignupForm} from "@snowl/app-store/reducers";
import {ShoutErrorResponse} from '@snowl/base-app/error';
import {LoginResponse, SignupResponse} from '@snowl/base-app/shared';

const USER_AUTHENTICATED = '[Auth] User Authenticated';

export class UserAuthenticatedAction implements Action {
  static readonly type = USER_AUTHENTICATED;
  readonly type = USER_AUTHENTICATED;

  constructor(public payload: [string, Subscriber]) {
  }
}

const USER_LOGIN = '[Auth] Login';
const USER_LOGIN_FAILED = '[Auth] Login Failed';

export class LoginAction implements Action {
  static readonly type = USER_LOGIN;
  readonly type = USER_LOGIN;

  constructor(public email: string, public password: string) {
  }
}

export class LoginFailedAction implements Action {
  static readonly type = USER_LOGIN_FAILED;
  readonly type = USER_LOGIN_FAILED;

  constructor(public payload: ShoutErrorResponse<LoginResponse>) {
  }
}

const USER_SIGNUP = '[Auth] Signup';
const USER_SIGNUP_FAILED = '[Auth] Signup Failed';

export class SignupAction implements Action {
  static readonly type = USER_SIGNUP;
  readonly type = USER_SIGNUP;

  constructor() {
  }
}

export class SignupFailedAction implements Action {
  static readonly type = USER_SIGNUP_FAILED;
  readonly type = USER_SIGNUP_FAILED;

  constructor(public payload: ShoutErrorResponse<SignupResponse>) {
  }
}

const LOGOUT_USER = '[Auth] Logout';

export class LogoutAction implements Action {
  static readonly type = LOGOUT_USER;
  readonly type = LOGOUT_USER;
}

const LOAD_SUBSCRIBER = '[Auth] Load Subscriber';
const LOAD_SUBSCRIBER_SUCCESS = '[Auth] Load Subscriber Success';
const LOAD_SUBSCRIBER_FAIL = '[Auth] Load Subscriber Fail';

export class LoadSubscriberAction implements Action {
  static readonly type = LOAD_SUBSCRIBER;
  readonly type = LOAD_SUBSCRIBER;
}

export class LoadSubscriberSuccessAction implements Action {
  static readonly type = LOAD_SUBSCRIBER_SUCCESS;
  readonly type = LOAD_SUBSCRIBER_SUCCESS;

  constructor(public payload: Subscriber) {
  }
}

export class LoadSubscriberFailAction implements Action {
  static readonly type = LOAD_SUBSCRIBER_FAIL;
  readonly type = LOAD_SUBSCRIBER_FAIL;

  constructor(public payload: any) {
  }
}

const LOAD_SUBSCRIBER_GAMES = '[Auth] Load Subscriber Games';
const LOAD_SUBSCRIBER_GAMES_SUCCESS = '[Auth] Load Subscriber Games Success';
const LOAD_SUBSCRIBER_GAMES_FAIL = '[Auth] Load Subscriber Games Fail';

export class LoadSubscriberGamesAction implements Action {
  static readonly type = LOAD_SUBSCRIBER_GAMES;
  readonly type = LOAD_SUBSCRIBER_GAMES;

  constructor(public payload: Subscriber) {
  }
}

export class LoadSubscriberGamesSuccessAction implements Action {
  static readonly type = LOAD_SUBSCRIBER_GAMES_SUCCESS;
  readonly type = LOAD_SUBSCRIBER_GAMES_SUCCESS;

  constructor(public payload: NormalizedGame[]) {
  }
}

export class LoadSubscriberGamesFailAction implements Action {
  static readonly type = LOAD_SUBSCRIBER_GAMES_FAIL;
  readonly type = LOAD_SUBSCRIBER_GAMES_FAIL;

  constructor(public payload: any) {
  }
}

const UPDATE_SUBSCRIBER = '[Auth] Update Subscriber';

export class UpdateSubscriberAction implements Action {
  static readonly type = UPDATE_SUBSCRIBER;
  readonly type = UPDATE_SUBSCRIBER;

  constructor(public payload: Partial<Subscriber>) {
  }
}

const UPDATE_SIGNUP_FORM = '[Auth] Update Signup Form';

export class UpdateSignupFormAction implements Action {
  static readonly type = UPDATE_SIGNUP_FORM;
  readonly type = UPDATE_SIGNUP_FORM;

  constructor(public payload: Partial<SignupForm>) {

  }
}

const CHECKING_NICKNAME = '[Auth] Checking Nickname';
const CHECKING_NICKNAME_RESPONSE = '[Auth] Checking Nickname Response';

export class CheckingNicknameAction implements Action {
  static readonly type = CHECKING_NICKNAME;
  readonly type = CHECKING_NICKNAME;
}

export class CheckingNicknameResponseAction implements Action {
  static readonly type = CHECKING_NICKNAME_RESPONSE;
  readonly type = CHECKING_NICKNAME_RESPONSE;

  constructor(public payload: boolean) {
  }
}

export type AuthActions =
  | UserAuthenticatedAction
  | LoginAction
  | LoginFailedAction
  | SignupAction
  | SignupFailedAction
  | LogoutAction
  | LoadSubscriberAction
  | LoadSubscriberFailAction
  | LoadSubscriberSuccessAction
  | LoadSubscriberGamesAction
  | LoadSubscriberGamesFailAction
  | LoadSubscriberGamesSuccessAction
  | UpdateSubscriberAction
  | UpdateSignupFormAction
  | CheckingNicknameAction
  | CheckingNicknameResponseAction;
