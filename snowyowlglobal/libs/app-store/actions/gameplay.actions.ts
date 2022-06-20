import { Action } from '@ngrx/store';
import { Answer } from '@snowl/base-app/model/answer';
import {Game, Question} from '@snowl/base-app/model';
import {BeginPoolPlayResponse, JoinGameResponse} from '@snowl/base-app/shared';
import {ShoutErrorResponse} from '@snowl/base-app/error';

const JOIN_GAME = '[Gameplay] Join Game';
const JOIN_PRIVATE_GAME = '[Gameplay] Join Private Game';
const JOIN_GAME_FAIL = '[Gameplay] Join Game Fail';
const JOIN_GAME_SUCCESS = '[Gameplay] Join Game Success';

export class JoinGameAction implements Action {
  static readonly type = JOIN_GAME;
  readonly type = JOIN_GAME;
  constructor(public payload: string) {}
}

export class JoinPrivateGameAction implements Action {
  static readonly type = JOIN_PRIVATE_GAME;
  readonly type = JOIN_PRIVATE_GAME;
  constructor(public payload: string) {}
}

export class JoinGameFailAction implements Action {
  static readonly type = JOIN_GAME_FAIL;
  readonly type = JOIN_GAME_FAIL;
  constructor(public payload: ShoutErrorResponse<JoinGameResponse>) {}
}

export class JoinGameSuccessAction implements Action {
  static readonly type = JOIN_GAME_SUCCESS;
  readonly type = JOIN_GAME_SUCCESS;

  constructor(public gameId: string) {}
}

const PLAY_POOL_PLAY = '[Gameplay] Play Pool Play';
const PLAY_POOL_PLAY_FAIL = '[Gameplay] Play Pool Play Fail';
export class PlayPoolPlayAction implements Action {
  static readonly type = PLAY_POOL_PLAY;
  readonly type = PLAY_POOL_PLAY;
  constructor(public payload: string) {}
}

export class PlayPoolPlayFailAction implements Action {
  static readonly type = PLAY_POOL_PLAY_FAIL;
  readonly type = PLAY_POOL_PLAY_FAIL;
  constructor(public payload: ShoutErrorResponse<BeginPoolPlayResponse | JoinGameResponse>) {}
}

const ANSWER_QUESTION = '[Gameplay] Answer Question';
export class AnswerQuestionAction implements Action {
  static readonly type = ANSWER_QUESTION;
  readonly type = ANSWER_QUESTION;
  constructor(public payload: { question: Question; answer: Answer }) {}
}

const CURRENT_GAME_COUNT = '[Gameplay] Recieved Current Game Count';
export class CurrentGameCountAction implements Action {
  static readonly type = CURRENT_GAME_COUNT;
  readonly type = CURRENT_GAME_COUNT;
  constructor(public payload: number) {}
}

const SHOW_GAME_RESULTS_DIALOG = '[Gameplay] Show game results dialog';
export class ShowGameResultsDialogAction implements Action {
  static readonly type = SHOW_GAME_RESULTS_DIALOG;
  readonly type = SHOW_GAME_RESULTS_DIALOG;
  constructor (public payload: Game) { }
}

/**
 * Sets the bracket countdown time.  An undefined time means that we don't yet know the countdown
 */
const BRACKET_COUNTDOWN_TIME = '[Gameplay] Bracket countdown time';
export class BracketCountdownTimeAction implements Action {
  static readonly type = BRACKET_COUNTDOWN_TIME;
  readonly type = BRACKET_COUNTDOWN_TIME;
  constructor (public payload?: number) {}
}

const SET_CLIENT_TIME_DRIFT = '[Gameplay] Set Client Time Drift';
export class SetClientTimeDriftAction implements Action {
  static readonly type = SET_CLIENT_TIME_DRIFT;
  readonly type = SET_CLIENT_TIME_DRIFT;
  constructor (public payload: number) {}
}

export type GameplayActions =
  | JoinGameAction
  | JoinPrivateGameAction
  | JoinGameFailAction
  | JoinGameSuccessAction
  | PlayPoolPlayAction
  | PlayPoolPlayFailAction
  | AnswerQuestionAction
  | CurrentGameCountAction
  | ShowGameResultsDialogAction
  | BracketCountdownTimeAction
  | SetClientTimeDriftAction;
