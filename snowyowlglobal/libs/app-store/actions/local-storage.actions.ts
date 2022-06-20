import {Action} from '@ngrx/store';
import {LocalStorageState} from '@snowl/app-store/reducers/local-storage.reducer';

const LOCAL_STORAGE_SET = '[Local Storage] Set';
const LOCAL_STORAGE_GET = '[Local Storage] Get';
const LOCAL_STORAGE_GET_SUCCESS = '[Local Storage] Get Success';
const LOCAL_STORAGE_REMOVE = '[Local Storage] Remove';
const LOCAL_STORAGE_CLEAR = '[Local Storage] Clear';

export class SetLocalStorageAction implements Action {
  static readonly type = LOCAL_STORAGE_SET;
  readonly type = LOCAL_STORAGE_SET;

  constructor(public payload: Partial<LocalStorageState>) {
  }
}

export class GetLocalStorage implements Action {
  static readonly type = LOCAL_STORAGE_GET;
  readonly type = LOCAL_STORAGE_GET;
}

export class GetLocalStorageSuccessAction implements Action {
  static readonly type = LOCAL_STORAGE_GET_SUCCESS;
  readonly type = LOCAL_STORAGE_GET_SUCCESS;

  constructor(public payload: LocalStorageState) {
  }
}

export class RemoveLocalStorageAction implements Action {
  static readonly type = LOCAL_STORAGE_REMOVE;
  readonly type = LOCAL_STORAGE_REMOVE;

  constructor(public payload: Array<keyof LocalStorageState>) {
  }
}

export class ClearLocalStorageAction implements Action {
  static readonly type = LOCAL_STORAGE_CLEAR;
  readonly type = LOCAL_STORAGE_CLEAR;

  // Removes all local storage except for those in the exceptions array
  constructor(public exceptions: Array<keyof LocalStorageState>) {
  }
}

export type LocalStorageActions =
  | SetLocalStorageAction
  | GetLocalStorage
  | GetLocalStorageSuccessAction
  | RemoveLocalStorageAction
  | ClearLocalStorageAction;
