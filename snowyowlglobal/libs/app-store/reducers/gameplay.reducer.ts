import { ActionReducer } from '@ngrx/store';
import {
  BracketCountdownTimeAction,
  CurrentGameCountAction,
  GameplayActions,
  JoinGameAction,
  JoinGameFailAction,
  JoinGameSuccessAction,
  JoinPrivateGameAction,
  SetClientTimeDriftAction,
} from '@snowl/app-store/actions/gameplay.actions';

export interface GameplayState {
  joiningGame: boolean;
  currentPlayerCount?: number;
  bracketCountdownTime?: number;
  clientTimeDrift: number;
}

const initialState: GameplayState = {
  joiningGame: false,
  clientTimeDrift: 0
};

export function gameplayReducer(state = initialState, action: GameplayActions): GameplayState {
  switch (action.type) {
    case JoinGameAction.type:
    case JoinPrivateGameAction.type:
      return {
        ...state,
        joiningGame: true
      };

    case JoinGameFailAction.type:
    case JoinGameSuccessAction.type:
      return {
        ...state,
        joiningGame: false
      };
    case CurrentGameCountAction.type:
      return {
        ...state,
        currentPlayerCount: action.payload
      };
    case BracketCountdownTimeAction.type:
      return {
        ...state,
        bracketCountdownTime: action.payload
      };
    case SetClientTimeDriftAction.type:
      return {
        ...state,
        clientTimeDrift: action.payload
      };
    default:
      return state;
  }
}
