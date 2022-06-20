import {
  ClearLocalStorageAction,
  GetLocalStorageSuccessAction,
  LocalStorageActions,
  RemoveLocalStorageAction,
  SetLocalStorageAction
} from '../actions';
import { Subscriber } from '@snowl/base-app/model';

export interface LocalStorageState {
  deviceId?: string;
  sessionKey?: string;
  subscriber?: string;
  sentFreeplayNotifications?: string;
  referralNickname?: string;
  referralUrl?: string;
}

let defaultState: LocalStorageState = {};

export function localStorageReducer(state = defaultState, action: LocalStorageActions): LocalStorageState {
  switch (action.type) {
    case GetLocalStorageSuccessAction.type: {
      const result = {
        ...state,
        ...action.payload
      };
      defaultState = { ...defaultState, deviceId: result.deviceId }; // Keeps the device id on logout
      return result;
    }
    case SetLocalStorageAction.type: {
      const result = {
        ...state,
        ...action.payload
      };
      defaultState = { ...defaultState, deviceId: result.deviceId }; // Keeps the device id on logout
      return result;
    }
    case RemoveLocalStorageAction.type: {
      const toRemove: any = {};
      for (const remove of action.payload) {
        toRemove[remove] = undefined;
      }
      return { ...state, ...toRemove };
    }
    case ClearLocalStorageAction.type: {
      const newState: LocalStorageState = {...defaultState};
      action.exceptions.forEach(exception => {
        newState[exception] = state[exception];
      });
      return newState;
    }

    default:
      return state;
  }
}
