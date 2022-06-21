import {Injectable} from '@angular/core';
import {Actions, Effect, ofType, ROOT_EFFECTS_INIT} from '@ngrx/effects';
import {BaseHttpService} from '@snowl/base-app/shared/services/base-http.service';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {LoadSrd, LoadSrdFail, LoadSrdSuccessAction} from '../actions';
import {LoadCanSeeContentWithoutLoginSuccessAction} from "@snowl/app-store/actions";
import {BooleanFlag} from "@snowl/base-app/model";
import {of} from "rxjs";

@Injectable()
export class HttpEffects {
  @Effect()
  loadSrd$ = this.actions$.pipe(
    ofType<LoadSrd>(LoadSrd.type),
    mergeMap(() => {
      return this.httpService.loadSrd().pipe(
        map(srd => new LoadSrdSuccessAction(srd)),
        catchError(err => of(new LoadSrdFail(err)))
      )
    })
  );

  @Effect()
  checkForForcedLogin = this.actions$.pipe(
    ofType<LoadSrdSuccessAction>(LoadSrdSuccessAction.type),
    mergeMap(() => {
      return this.httpService.getWdsDoc<BooleanFlag<'canSeeContentWithoutLogin'>>('/canSeeContentWithoutLogin.json').pipe(
        map(canSee => {
          return new LoadCanSeeContentWithoutLoginSuccessAction(canSee.canSeeContentWithoutLogin);
        })
      )
    })
  );

  @Effect() onLoad = this.actions$.pipe(ofType(ROOT_EFFECTS_INIT), map(() => new LoadSrd()));

  constructor(private httpService: BaseHttpService, private actions$: Actions) {
  }
}
