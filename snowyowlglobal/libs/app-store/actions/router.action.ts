import { Action } from '@ngrx/store';
import { NavigationExtras } from '@angular/router';

const GO = '[Router] Go';
const BACK = '[Router] Back';
const NAVIGATED_BACK = '[Router] Navigated Back';
const FORWARD = '[Router] Forward';

export interface NavigationOptions {
  clearHistory?: boolean;
  animated?: boolean;
  transition?: any;
}
export type ExtendedNavigationExtras = NavigationExtras & NavigationOptions;

export class GoAction implements Action {
  static readonly type = GO;
  readonly type = GO;
  constructor(public path: any[], public extras?: ExtendedNavigationExtras) {}
}

export class BackAction implements Action {
  static readonly type = BACK;
  readonly type = BACK;
  constructor(public payload: string, public extras?: ExtendedNavigationExtras) {}
}
export class NavigatedBackAction implements Action {
  static readonly type = NAVIGATED_BACK;
  readonly type = NAVIGATED_BACK;
}

export class Forward implements Action {
  static readonly type = FORWARD;
  readonly type = FORWARD;
}

export type RouterActions = GoAction | BackAction | Forward | NavigatedBackAction;
