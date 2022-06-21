import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

import {Actions, Effect, ofType} from '@ngrx/effects';
import * as RouterActions from '@snowl/app-store/actions';
import {BackAction, GoAction, NavigatedBackAction} from '@snowl/app-store/actions';

import {mergeMap, tap, withLatestFrom} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {AppState} from '@snowl/app-store/reducers';
import {getRouterHistory} from '@snowl/app-store/selectors';

@Injectable()
export class RouterEffects {
  @Effect({dispatch: false})
  navigate$ = this.actions$.pipe(
    ofType<RouterActions.GoAction>(RouterActions.GoAction.type),
    tap(action => {
      this.router.navigate(action.path, action.extras);
    })
  );
  @Effect()
  navigateBack$ = this.actions$.pipe(
    ofType<BackAction>(BackAction.type),
    withLatestFrom(this.store.pipe(select(getRouterHistory))),
    mergeMap(([action, history]) => {
      if (history.length > 0) {
        return [new GoAction([history[history.length - 1]])];
      } else {
        return [new NavigatedBackAction(), new GoAction([action.payload])];
      }
    })
  );
  @Effect({dispatch: false})
  navigateForward$ = this.actions$.pipe(ofType(RouterActions.Forward.type), tap(() => this.location.forward()));

  constructor(
    private actions$: Actions,
    private router: Router,
    private location: Location,
    private store: Store<AppState>
  ) {
  }
}
