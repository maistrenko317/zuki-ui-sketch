import { SRD } from '@snowl/base-app/model';
import {HttpActions, LoadCanSeeContentWithoutLoginSuccessAction, LoadSrdSuccessAction} from '../actions/http.actions';

export interface HttpState {
  srd: SRD | null;
  canSeeContentWithoutLogin?: boolean;
}

let initialState: HttpState = {
  srd: null
};

export function httpReducer(state = initialState, action: HttpActions): HttpState {
  switch (action.type) {
    case LoadSrdSuccessAction.type:
      initialState = {
        ...initialState,
        srd: action.payload // this keeps the srd around on logout
      };

      return {
        ...state,
        srd: action.payload
      };
    case LoadCanSeeContentWithoutLoginSuccessAction.type:
      initialState = {
        ...initialState,
        canSeeContentWithoutLogin: action.payload // this keeps the can see content on logout
      };

      return {
        ...state,
        canSeeContentWithoutLogin: action.payload
      };
    default:
      return state;
  }
}
