import { Action } from '@ngrx/store';
import { HomeTab } from '../reducers';
import { HomeGameView } from '@snowl/base-app/home';

const SELECT_HOME_TAB = '[Home] select tab';
export class SelectHomeTabAction implements Action {
  static readonly type = SELECT_HOME_TAB;
  readonly type = SELECT_HOME_TAB;
  constructor(public payload: HomeTab) {}
}

const SELECT_GAME_VIEW = '[Home] Select game view';

export class SelectGameViewAction implements Action {
  static readonly type = SELECT_GAME_VIEW;
  readonly type = SELECT_GAME_VIEW;

  constructor(public payload: HomeGameView) {}
}

export type HomeLayoutActions = SelectHomeTabAction | SelectGameViewAction;
