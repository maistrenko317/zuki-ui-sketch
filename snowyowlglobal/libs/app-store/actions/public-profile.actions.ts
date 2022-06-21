import { Action } from '@ngrx/store';
import { PublicProfile } from '@snowl/base-app/model/public-profile';

const LOAD_PUBLIC_PROFILES = '[Public Profile] Load Public Profile';
const LOAD_PUBLIC_PROFILES_SUCCESS = '[Public Profile] Load Public Profile Success';
const LOAD_PUBLIC_PROFILES_FAIL = '[Public Profile] Load Public Profile Fail';
export class LoadPublicProfilesAction implements Action {
  static readonly type = LOAD_PUBLIC_PROFILES;
  readonly type = LOAD_PUBLIC_PROFILES;
  constructor(public payload: number[]) {}
}

export class LoadPublicProfilesFailAction implements Action {
  static readonly type = LOAD_PUBLIC_PROFILES_FAIL;
  readonly type = LOAD_PUBLIC_PROFILES_FAIL;
  constructor(public payload: any) {}
}

export class LoadPublicProfilesSuccessAction implements Action {
  static readonly type = LOAD_PUBLIC_PROFILES_SUCCESS;
  readonly type = LOAD_PUBLIC_PROFILES_SUCCESS;
  constructor(public payload: PublicProfile[]) {}
}

export type PublicProfileActions =
  | LoadPublicProfilesAction
  | LoadPublicProfilesFailAction
  | LoadPublicProfilesSuccessAction;
