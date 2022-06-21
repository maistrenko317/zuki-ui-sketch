import {Injectable} from '@angular/core';
import {Actions, Effect, ofType, ROOT_EFFECTS_INIT} from '@ngrx/effects';
import {map, tap} from 'rxjs/operators';
import {AppState, LocalStorageState} from '../reducers';
import {BaseLocalStorage} from '@snowl/base-app/shared';
import {
  ClearLocalStorageAction,
  GetLocalStorage,
  GetLocalStorageSuccessAction,
  SetLocalStorageAction
} from '../actions';
import {Store} from '@ngrx/store';
import {RemoveLocalStorageAction} from '@snowl/app-store/actions';
import {uuid} from "@snowl/base-app/util";

const LOCAL_STORAGE_MAP: { [k in keyof LocalStorageState]: string } = {
  deviceId: 'dev',
  sessionKey: 'sk',
  subscriber: 'sub',
  sentFreeplayNotifications: 'sfn',
  referralNickname: 'subr',
  referralUrl: 'refu'
};
const LOCAL_STORAGE_ENTRIES = Object.entries(LOCAL_STORAGE_MAP) as [keyof LocalStorageState, string][];

@Injectable()
export class LocalStorageEffects {
  @Effect({dispatch: false})
  setLocalStorage = this.actions$.pipe(
    ofType<SetLocalStorageAction>(SetLocalStorageAction.type),
    map(action => action.payload),
    tap(toSet => {
      for (const key in toSet) {
        if (toSet.hasOwnProperty(key)) {
          const k = key as keyof LocalStorageState;
          this.localStorage.set(LOCAL_STORAGE_MAP[k]!, toSet[k]!);
        }
      }
    })
  );

  @Effect()
  getLocalStorage = this.actions$.pipe(
    ofType<GetLocalStorage>(GetLocalStorage.type),
    map(() => {
      const result = LOCAL_STORAGE_ENTRIES.reduce((obj, [key, localStorageName]) => {
        obj[key] = this.localStorage.get(localStorageName);
        return obj;
      }, {} as LocalStorageState);

      // Ensures we always have a deviceId
      if (!result.deviceId) {
        result.deviceId = uuid();
        this.store.dispatch(new SetLocalStorageAction({deviceId: result.deviceId}));
      }

      return new GetLocalStorageSuccessAction(result);
    })
  );

  @Effect({dispatch: false})
  removeLocalStorage = this.actions$.pipe(
    ofType<RemoveLocalStorageAction>(RemoveLocalStorageAction.type),
    tap(action => {
      action.payload.forEach(remove => this.localStorage.remove(LOCAL_STORAGE_MAP[remove]!));
    })
  );

  @Effect({dispatch: false})
  clearLocalStorage = this.actions$.pipe(
    ofType<ClearLocalStorageAction>(ClearLocalStorageAction.type),
    tap(action => {
      LOCAL_STORAGE_ENTRIES.forEach(([keyToRemove, localStorageName]) => {
        if (!action.exceptions.includes(keyToRemove)) {
          this.localStorage.remove(localStorageName);
        }
      })
    })
  );

  @Effect() onLoad = this.actions$.pipe(ofType(ROOT_EFFECTS_INIT), map(() => new GetLocalStorage()));

  constructor(
    private localStorage: BaseLocalStorage,
    private actions$: Actions,
    private store: Store<AppState>
  ) {
  }
}
