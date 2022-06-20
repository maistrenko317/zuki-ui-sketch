import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {SerializedRoute} from '@snowl/app-store/reducers';
import {getPrivacyDoc, getTermsDoc} from '@snowl/app-store/selectors';
import {ROUTER_NAVIGATION, RouterNavigationAction} from '@ngrx/router-store';
import {catchError, filter, map, mergeMap} from 'rxjs/operators';
import {
  LoadPrivacyDocAction,
  LoadPrivacyDocSuccessAction,
  LoadTermsDocAction,
  LoadTermsDocSuccessAction
} from '@snowl/app-store/actions';
import {BasePrivacyComponent, BaseTermsComponent} from '@snowl/base-app/legal';
import {select, Store} from '@ngrx/store';
import {BaseLegalService} from '@snowl/base-app/legal/base-legal.service';
import {NEVER} from 'rxjs';
import {getValue} from "@snowl/base-app/util";

@Injectable()
export class LegalEffects {
  @Effect()
  shouldLoadTerm = this.actions$.pipe(
    ofType<RouterNavigationAction<SerializedRoute>>(ROUTER_NAVIGATION),
    map(e => e.payload.routerState),
    filter(state => !!state.component && BaseTermsComponent.isPrototypeOf(state.component)), // the route has the terms
    map(() => getValue(this.store.pipe(select(getTermsDoc)))), // check to see if we have the terms
    filter(terms => !terms), // Ensure we don't have them already
    map(() => new LoadTermsDocAction())
  );

  @Effect()
  shouldLoadPrivacy = this.actions$.pipe(
    ofType<RouterNavigationAction<SerializedRoute>>(ROUTER_NAVIGATION),
    map(e => e.payload.routerState),
    filter(state => !!state.component && BasePrivacyComponent.isPrototypeOf(state.component)), // the route has the privacy
    map(() => getValue(this.store.pipe(select(getPrivacyDoc)))), // check to see if we have the privacy doc
    filter(terms => !terms), // Ensure we don't have them already
    map(() => new LoadPrivacyDocAction())
  );

  @Effect()
  loadTermsDoc = this.actions$.pipe(
    ofType<LoadTermsDocAction>(LoadTermsDocAction.type),
    mergeMap(() => {
      return this.legalService.loadTerms().pipe(
        map(terms => new LoadTermsDocSuccessAction(terms)),
        catchError(() => NEVER) // TODO: Handle error
      );
    })
  );

  @Effect()
  loadPrivacyDoc = this.actions$.pipe(
    ofType<LoadPrivacyDocAction>(LoadPrivacyDocAction.type),
    mergeMap(() => {
      return this.legalService.loadPrivacy().pipe(
        map(terms => new LoadPrivacyDocSuccessAction(terms)),
        catchError(() => NEVER) // TODO: Handle error
      );
    })
  );

  constructor(private actions$: Actions, private store: Store<any>, private legalService: BaseLegalService) {
  }
}
