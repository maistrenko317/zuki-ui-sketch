import { ActivatedRouteSnapshot, Params, RouterStateSnapshot } from '@angular/router';
import * as fromRouter from '@ngrx/router-store';
import { Type } from '@angular/core';
import {ROUTER_CANCEL, ROUTER_ERROR, ROUTER_NAVIGATION, RouterAction} from '@ngrx/router-store';
import {BackAction, GoAction, NavigatedBackAction, RouterActions} from '@snowl/app-store/actions';
import { immutablePop } from '@snowl/base-app/util';
import { Action } from '@ngrx/store';

export interface SerializedRoute {
  url: string;
  queryParams: Params;
  params: Params;
  component: Type<any> | string | null;
}

export class CustomSerializer implements fromRouter.RouterStateSerializer<SerializedRoute> {
  serialize(routerState: RouterStateSnapshot): SerializedRoute {
    const { url } = routerState;
    const { queryParams } = routerState.root;
    let component = routerState.root.component;

    let state: ActivatedRouteSnapshot = routerState.root;
    let params = state.params;
    while (state.firstChild) {
      state = state.firstChild;
      component = state.component || component;
      params = { ...params, ...state.params };
    }

    return { url, queryParams, params, component };
  }
}

export interface RouterState {
  state?: SerializedRoute;
  history: string[];
}
const defaultState: RouterState = {
  history: []
};

export function routerReducer(
  state = defaultState,
  action: RouterActions | RouterAction<any, SerializedRoute>
): RouterState {
  switch (action.type) {
    case ROUTER_NAVIGATION: {
      const url = action.payload.routerState.url;
      let index: number;
      let history: string[];
      if ((index = state.history.indexOf(url)) === -1) {
        history = [...state.history, url];
      } else {
        history = state.history.slice(0, index + 1);
      }
      return {
        state: action.payload.routerState,
        history
      };
    }
    case GoAction.type:
      return action.extras && action.extras.clearHistory ? {...state, history: []} : state;
    case BackAction.type:
    case NavigatedBackAction.type:
      return {
        ...state,
        history: immutablePop(state.history)
      };
    default:
      return state;
  }
}
