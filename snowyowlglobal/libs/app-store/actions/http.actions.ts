import { Action } from '@ngrx/store';
import { SRD } from '@snowl/base-app/model';

const LOAD_SRD = '[http] Load SRD';
const LOAD_SRD_SUCCESS = '[http] Load SRD Success';
const LOAD_SRD_FAIL = '[http] Load SRD Fail';
export class LoadSrd implements Action {
  static readonly type = LOAD_SRD;
  readonly type = LOAD_SRD;
}
export class LoadSrdSuccessAction implements Action {
  static readonly type = LOAD_SRD_SUCCESS;
  readonly type = LOAD_SRD_SUCCESS;
  constructor(public payload: SRD) {}
}
export class LoadSrdFail implements Action {
  static readonly type = LOAD_SRD_FAIL;
  readonly type = LOAD_SRD_FAIL;
  constructor(public payload: any) {}
}

const LOAD_CAN_SEE_CONTENT_WITHOUT_LOGIN_SUCCESS = '[http] Load can see content without login success';
export class LoadCanSeeContentWithoutLoginSuccessAction implements Action {
  static readonly type = LOAD_CAN_SEE_CONTENT_WITHOUT_LOGIN_SUCCESS;
  readonly type = LOAD_CAN_SEE_CONTENT_WITHOUT_LOGIN_SUCCESS;
  constructor (public payload: boolean) {}
}

export type HttpActions = LoadSrd | LoadSrdSuccessAction | LoadSrdFail | LoadCanSeeContentWithoutLoginSuccessAction;
