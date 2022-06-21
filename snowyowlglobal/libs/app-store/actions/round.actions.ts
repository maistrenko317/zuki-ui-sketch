import { Action } from '@ngrx/store';
import { Question, Round } from '@snowl/base-app/model';

const LOAD_ROUNDS_SUCCESS = '[Round] Load Rounds Success';
export class LoadRoundsSuccessAction implements Action {
  static readonly type = LOAD_ROUNDS_SUCCESS;
  readonly type = LOAD_ROUNDS_SUCCESS;
  constructor(public payload: Round[]) {}
}

const OPEN_ROUND = '[Round] Open Round';
export class OpenRoundAction implements Action {
  static readonly type = OPEN_ROUND;
  readonly type = OPEN_ROUND;
  constructor(public payload: string) {}
}

const CLOSE_ROUND = '[Round] Close Round';
export class CloseRoundAction implements Action {
  static readonly type = CLOSE_ROUND;
  readonly type = CLOSE_ROUND;
}

const DECRYPT_QUESTION_SUCCESS = '[Round] Decrypt Question Success';
export class DecryptQuestionSuccessAction implements Action {
  static readonly type = DECRYPT_QUESTION_SUCCESS;
  readonly type = DECRYPT_QUESTION_SUCCESS;
  constructor(public payload: Question) {}
}


const TIE_BREAKER_COMING = '[Gameplay] Tie Breaker Coming';
export class TieBreakerComingAction implements Action {
  static readonly type = TIE_BREAKER_COMING;
  readonly type = TIE_BREAKER_COMING;
  constructor (public payload: number) {}
}

export type RoundActions = LoadRoundsSuccessAction | OpenRoundAction | CloseRoundAction | DecryptQuestionSuccessAction | TieBreakerComingAction;
