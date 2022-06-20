import { Action } from '@ngrx/store';
import {Game, GamePayoutLevel, GamePayouts, NormalizedGame, Subscriber, SyncMessage} from '@snowl/base-app/model';

const LOAD_GAMES = '[Games] Load Games';
const LOAD_GAMES_FAIL = '[Games] Load Games Fail';
const LOAD_GAMES_SUCCESS = '[Games] Load Games Success';

export class LoadGamesAction implements Action {
  static readonly type = LOAD_GAMES;
  readonly type = LOAD_GAMES;
}

export class LoadGamesFailAction implements Action {
  static readonly type = LOAD_GAMES_FAIL;
  readonly type = LOAD_GAMES_FAIL;

  constructor(public payload: any) {}
}

export class LoadGamesSuccessAction implements Action {
  static readonly type = LOAD_GAMES_SUCCESS;
  readonly type = LOAD_GAMES_SUCCESS;

  constructor(public payload: NormalizedGame[]) {}
}

const LOAD_GAME = '[Games] Load Game';
const LOAD_GAME_FAIL = '[Games] Load Game Fail';
const LOAD_GAME_SUCCESS = '[Games] Load Game Success';

/**
 * Triggers the loading of a game and it's sync messages
 */
export class LoadGameAction implements Action {
  static readonly type = LOAD_GAME;
  readonly type = LOAD_GAME;
  constructor(public payload: string) {}
}

export class LoadGameFailAction implements Action {
  static readonly type = LOAD_GAME_FAIL;
  readonly type = LOAD_GAME_FAIL;

  constructor(public payload: any) {}
}

export class LoadGameSuccessAction implements Action {
  static readonly type = LOAD_GAME_SUCCESS;
  readonly type = LOAD_GAME_SUCCESS;

  constructor(public payload: NormalizedGame) {}
}



const LOAD_GAME_PAYOUTS = '[Game] Load Payouts';
const LOAD_GAME_PAYOUTS_SUCCESS = '[Game] Load Payouts Success';

export class LoadGamePayoutsAction implements Action {
  static readonly type = LOAD_GAME_PAYOUTS;
  readonly type = LOAD_GAME_PAYOUTS;
  constructor (public payload: string) {}
}

export class LoadGamePayoutsSuccessAction implements Action {
  static readonly type = LOAD_GAME_PAYOUTS_SUCCESS;
  readonly type = LOAD_GAME_PAYOUTS_SUCCESS;

  constructor(public payload: GamePayouts, public gameId: string) {}
}

const LOAD_GAME_ACTUAL_PAYOUTS = '[Game] Load Actual Payouts';
const LOAD_GAME_ACTUAL_PAYOUTS_SUCCESS = '[Game] Load Actual Payouts Success';

export class LoadGameActualPayoutsAction implements Action {
  static readonly type = LOAD_GAME_ACTUAL_PAYOUTS;
  readonly type = LOAD_GAME_ACTUAL_PAYOUTS;
  constructor (public payload: string) {}
}

export class LoadGameActualPayoutsSuccessAction implements Action {
  static readonly type = LOAD_GAME_ACTUAL_PAYOUTS_SUCCESS;
  readonly type = LOAD_GAME_ACTUAL_PAYOUTS_SUCCESS;

  constructor(public payload: GamePayoutLevel, public gameId: string) {}
}

export type GameActions =
  | LoadGamesAction
  | LoadGamesFailAction
  | LoadGamesSuccessAction
  | LoadGameAction
  | LoadGameFailAction
  | LoadGameSuccessAction
  | LoadGamePayoutsAction
  | LoadGamePayoutsSuccessAction
  | LoadGameActualPayoutsAction
  | LoadGameActualPayoutsSuccessAction
