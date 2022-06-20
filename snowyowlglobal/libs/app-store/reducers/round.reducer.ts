import { Round } from '@snowl/base-app/model';
import { ActionReducer } from '@ngrx/store';
import {
  CloseRoundAction, DecryptQuestionSuccessAction,
  LoadRoundsSuccessAction,
  OpenRoundAction,
  RoundActions, TieBreakerComingAction
} from '@snowl/app-store/actions/round.actions';
import {
} from '@snowl/app-store/actions';
import { keyBy } from '@snowl/base-app/util';

export interface RoundsState {
  entities: { [id: string]: Round };
  currentRound?: string;
}

const initialState: RoundsState = {
  entities: {}
};

export function roundsReducer(state = initialState, action: RoundActions): RoundsState {
  switch (action.type) {
    case LoadRoundsSuccessAction.type: {
      // This updates the existing rounds.
      const updatedRounds = action.payload.reduce<{[id: string]: Round}>((entities, round) => {
        entities[round.id] = {...state.entities[round.id], ...round};
        return entities;
      }, {});

      return {
        ...state,
        entities: { ...state.entities, ...updatedRounds }
      };
    }
    case OpenRoundAction.type: {
      return {
        ...state,
        currentRound: action.payload
      };
    }
    case CloseRoundAction.type: {
      return {
        ...state,
        currentRound: undefined
      };
    }
    case DecryptQuestionSuccessAction.type: {
      const question = action.payload;
      const round = state.entities[state.currentRound!];
      const questions = [...round.questions, question];
      return {
        ...state,
        entities: {
          ...state.entities,
          [state.currentRound!]: {
            ...round,
            questions
          }
        }
      };
    }
    case TieBreakerComingAction.type: {
      const round = state.entities[state.currentRound!];
      return {
        ...state,
        entities: {
          ...state.entities,
          [state.currentRound!]: {
            ...round,
            tieBreakerComingTime: new Date(Date.now() + action.payload)
          }
        }
      };
    }
    default:
      return state;
  }
}
