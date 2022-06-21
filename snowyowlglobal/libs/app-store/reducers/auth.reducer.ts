import { Game, NormalizedGame, Subscriber } from '@snowl/base-app/model';
import * as actions from '../actions/auth.actions';
import { ActionReducer, MetaReducer } from '@ngrx/store';
import { AppState } from '@snowl/app-store/reducers/index';

export interface SignupForm {
  firstName?: string,
  lastName?: string,
  email?: string,
  nickname?: string,
  birthDate?: Date,
  password?: string,
  passwordConf?: string,
  isAdult?: boolean,
  region?: string;
}

export interface AuthState {
  subscriber?: Subscriber;
  sessionKey?: string;
  loggingIn: boolean;
  signingUp: boolean;
  loadingSubscriber: boolean;
  loadingSubscriberGames: boolean;
  subscriberGames: NormalizedGame[];
  signupForm: SignupForm;
  checkingNickname: boolean;
  validNickname: boolean;
}
const emptySubscriber: Subscriber = {
  nickname: 'Anonymous',
  gamePlayers: [],
} as any;

const baseState: AuthState = {
  subscriber: emptySubscriber,
  loggingIn: false,
  signingUp: false,
  loadingSubscriber: false,
  loadingSubscriberGames: false,
  subscriberGames: [],
  signupForm: {},
  checkingNickname: false,
  validNickname: true
};

export function authReducer(state = baseState, action: actions.AuthActions): AuthState {
  switch (action.type) {
    case actions.UserAuthenticatedAction.type:
      return {
        ...state,
        sessionKey: action.payload[0],
        subscriber: action.payload[1],
        loggingIn: false,
        signingUp: false,
        signupForm: {}
      };
    case actions.LoginAction.type:
      return {
        ...state,
        loggingIn: true
      };

    case actions.LoginFailedAction.type:
      return {
        ...state,
        loggingIn: false
      };

    case actions.SignupAction.type:
      return {
        ...state,
        signingUp: true
      };
    case actions.SignupFailedAction.type:
      return {
        ...state,
        signingUp: false
      };
    case actions.LoadSubscriberAction.type:
      return {
        ...state,
        loadingSubscriber: true,
        loadingSubscriberGames: true
      };
    case actions.LoadSubscriberFailAction.type:
      return {
        ...state,
        loadingSubscriber: false
      };
    case actions.LoadSubscriberSuccessAction.type:
    case actions.UpdateSubscriberAction.type: {
      const sub = state.subscriber || ({} as Subscriber);
      return {
        ...state,
        loadingSubscriber: false,
        subscriber: {
          ...sub,
          ...action.payload!
        }
      };
    }
    case actions.LoadSubscriberGamesAction.type:
      return {
        ...state,
        loadingSubscriberGames: true
      };
    case actions.LoadSubscriberGamesFailAction.type:
      return {
        ...state,
        loadingSubscriberGames: false
      };
    case actions.LoadSubscriberGamesSuccessAction.type:
      const gameIds = new Set(action.payload.map(g => g.id));
      return {
        ...state,
        subscriberGames: action.payload,
        loadingSubscriberGames: false,
        subscriber: state.subscriber ? {
          ...state.subscriber,
          gamePlayers: state.subscriber.gamePlayers.filter(g => gameIds.has(g.gameId))
        } : undefined
      };
    case actions.UpdateSignupFormAction.type:
      return {
        ...state,
        signupForm: {
          ...state.signupForm,
          ...action.payload
        }
      };
    case actions.CheckingNicknameAction.type:
      return {
        ...state,
        checkingNickname: true
      };
    case actions.CheckingNicknameResponseAction.type:
      return {
        ...state,
        checkingNickname: false,
        validNickname: action.payload
      };
    default:
      return state;
  }
}

export function logoutMetaReducer(reducer: ActionReducer<AppState>): ActionReducer<any> {
  return function(state, action) {
    return reducer(action.type === actions.LogoutAction.type ? undefined : state, action);
  };
}
