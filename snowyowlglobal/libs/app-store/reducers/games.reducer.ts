import * as fromHome from '../actions/game.actions';
import {Game, NormalizedGame} from '@snowl/base-app/model';
import { keyBy } from '@snowl/base-app/util';

export interface GamesState {
  gameEntities: Dict<NormalizedGame>;
  loading: boolean;
  gameIds: string[];
}

const initialState: GamesState = {
  gameEntities: {},
  loading: false,
  gameIds: []
};

export function gamesReducer(state = initialState, action: fromHome.GameActions): GamesState {
  switch (action.type) {
    case fromHome.LoadGamesAction.type:
    case fromHome.LoadGameAction.type:
      return {
        ...state,
        loading: true
      };
    case fromHome.LoadGamesSuccessAction.type: {
      const gameEntities: {[id: string]: NormalizedGame} = {};
      const gameIds: string[] = [];
      action.payload.forEach(g => {gameEntities[g.id] = g; gameIds.push(g.id)});

      return {
        ...state,
        gameEntities: {
          ...state.gameEntities,
          ...gameEntities
        },
        gameIds,
        loading: false
      };
    }
    case fromHome.LoadGameSuccessAction.type: {
      return {
        ...state,
        gameEntities: {
          ...state.gameEntities,
          [action.payload.id]: action.payload
        },
        loading: false
      };
    }
    case fromHome.LoadGameFailAction.type:
    case fromHome.LoadGamesFailAction.type:
      return {
        ...state,
        loading: false
      };
    case fromHome.LoadGamePayoutsSuccessAction.type:
      return {
        ...state,
        gameEntities: {
          ...state.gameEntities,
          [action.gameId]: {
            ...state.gameEntities[action.gameId],
            payouts: action.payload,
            actualPayout: action.payload.actualPayout
          }
        }
      };
    case fromHome.LoadGameActualPayoutsAction.type:
      return {
        ...state,
        gameEntities: {
          ...state.gameEntities,
          [action.payload]: {
            ...state.gameEntities[action.payload],
            loadingActualPayout: true
          }
        }
      };
    case fromHome.LoadGameActualPayoutsSuccessAction.type:
      return {
        ...state,
        gameEntities: {
          ...state.gameEntities,
          [action.gameId]: {
            ...state.gameEntities[action.gameId],
            actualPayout: action.payload,
            loadingActualPayout: false
          }
        }
      };
    default:
      return state;
  }
}
