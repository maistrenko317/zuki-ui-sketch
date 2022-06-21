import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {
  LoadReferralInfoAction,
  LoadReferralInfoFailAction,
  LoadReferralInfoSuccessAction
} from '@snowl/home-store/actions/affiliate.actions';
import {catchError, filter, map, mapTo, startWith, switchMap, throttleTime} from 'rxjs/operators';
import {BaseAffiliateService} from '@snowl/base-app/home';
import {combineLatest, interval, NEVER, of} from 'rxjs';
import {BaseDialogService} from '@snowl/base-app/shared';
import {HttpErrorHandler} from '@snowl/base-app/error-handler';
import {SelectHomeTabAction} from '@snowl/home-store/actions';
import {ROUTER_NAVIGATION, RouterNavigationAction} from '@ngrx/router-store';
import {AppState, SerializedRoute} from '@snowl/app-store/reducers';
import {select, Store} from '@ngrx/store';
import {getAffiliateState, getReferredSubscribers} from '@snowl/home-store/selectors';
import {elseMap, resultMap} from 'ts-results/rxjs-operators';
import {getValue} from '@snowl/base-app/util';

@Injectable()
export class AffiliateEffects {

  @Effect()
  loadReferralInfo$ = this.actions$.pipe(
    ofType(LoadReferralInfoAction.type),
    switchMap(() => this.affiliateService.loadReferralInfo()),
    resultMap(resp => new LoadReferralInfoSuccessAction(resp.referredSubscribers, resp.referralTransactions)),
    elseMap(err => new LoadReferralInfoFailAction(err))
  );

  @Effect({dispatch: false})
  loadReferralInfoFail$ = this.actions$.pipe(
    ofType<LoadReferralInfoFailAction>(LoadReferralInfoFailAction.type),
    map((action) => {
      this.httpErrorHandler.handleError(action.payload, {

      }, 'An unexpected error occurred loading your referral info.  Please try again later.');
    })
  );

  @Effect()
  shouldLoadReferralInfo$ = this.actions$.pipe(
    ofType<RouterNavigationAction<SerializedRoute>>(ROUTER_NAVIGATION),
    map(e => e.payload.routerState),
    switchMap((routerState) => {
    const onReferrals = routerState.url.includes('home/referrals');
      const hasReferredSubscribers = false; //!!(getValue(this.store.pipe(select(getReferredSubscribers))) || []).length;

      return interval(60 * 1000).pipe( // Reload every 60 seconds.  This doesn't need to happen all the time
        hasReferredSubscribers ? mapTo(0) : startWith(0)  // Only load immediately if we don't have the referred subs
      ) ;
    }),
    map(() => new LoadReferralInfoAction())
  );

  constructor(private actions$: Actions, private affiliateService: BaseAffiliateService, private store: Store<AppState>,
              private dialog: BaseDialogService, private httpErrorHandler: HttpErrorHandler) {

  }
}
