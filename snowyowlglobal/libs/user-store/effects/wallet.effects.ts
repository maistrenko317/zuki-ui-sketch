import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {ROUTER_NAVIGATION, RouterNavigationAction} from '@ngrx/router-store';
import {catchError, filter, map, mergeMap, switchMap, tap, throttleTime} from 'rxjs/operators';
import {AppState, SerializedRoute} from '@snowl/app-store/reducers';
import {BaseAddMoneyComponent, BasePaymentService, BaseWalletComponent} from '@snowl/base-app/user';
import {
  LoadBankAccountsAction,
  LoadBankAccountsFailAction,
  LoadBankAccountsSuccessAction,
  LoadBillingAddressesAction,
  LoadBillingAddressesFailAction,
  LoadBillingAddressesSuccessAction,
  LoadCountriesSuccessAction,
  LoadCreditCardsAction,
  LoadCreditCardsSuccessAction,
  LoadVenueItemsAction,
  LoadVenueItemsFailAction,
  LoadVenueItemsSuccessAction,
  PurchaseItemAction,
  PurchaseItemFailAction,
  PurchaseItemSuccessAction, RedeemCouponAction, RedeemCouponFailAction, RedeemCouponSuccessAction,
  WithdrawMoneyAction,
  WithdrawMoneyFailAction,
  WithdrawMoneySuccessAction
} from '@snowl/user-store/actions/wallet.actions';
import {of} from 'rxjs';
import {BackAction, LoadSubscriberAction} from '@snowl/app-store/actions';
import {BaseDialogService, BaseSubscriberService} from '@snowl/base-app/shared';
import {Action, Store} from '@ngrx/store';
import {LogService} from '@snowl/base-app/shared/services/log.service';
import {HttpErrorHandler} from '@snowl/base-app/error-handler';
import {elseMap, resultMap, resultMergeMap} from 'ts-results/rxjs-operators';

@Injectable()
export class WalletEffects {
  @Effect()
  navigatedToPayment$ = this.actions$.pipe(
    ofType<RouterNavigationAction<SerializedRoute>>(ROUTER_NAVIGATION),
    map(e => e.payload.routerState),
    filter(
      state => !!state && !!state.url && state.url.includes('/user/wallet')
    ), // the route has to do with payment
    throttleTime(45000),
    mergeMap(() => [
      new LoadVenueItemsAction(),
      new LoadBillingAddressesAction(),
      new LoadBankAccountsAction(),
      new LoadCreditCardsAction(),
      new LoadSubscriberAction()
    ])
  );

  @Effect()
  loadVenueItems$ = this.actions$.pipe(
    ofType<LoadVenueItemsAction>(LoadVenueItemsAction.type),
    mergeMap(() => this.paymentService.getItemsForVenue()),
    resultMap(items => new LoadVenueItemsSuccessAction(items)),
    elseMap(err => new LoadVenueItemsFailAction(err))
  );

  @Effect()
  loadCreditCards$ = this.actions$.pipe(
    ofType<LoadCreditCardsAction>(LoadCreditCardsAction.type),
    mergeMap(() => {
      return this.paymentService.getStoredCards().pipe(
        map(cards => new LoadCreditCardsSuccessAction(cards))
      )
    })
  );

  @Effect()
  purchaseItem$ = this.actions$.pipe(
    ofType<PurchaseItemAction>(PurchaseItemAction.type),
    mergeMap(action => this.paymentService.purchase(action.payload.item, action.payload.method)),
    resultMergeMap(() => [new PurchaseItemSuccessAction(), new LoadSubscriberAction()]),
    elseMap(err => new PurchaseItemFailAction(err))
  );

  @Effect({dispatch: false})
  purchaseItemError$ = this.actions$.pipe(
    ofType<PurchaseItemFailAction>(PurchaseItemFailAction.type),
    tap((item) => {
      this.dialog.open({
        title: 'Error',
        message: 'We were unable to process your purchase.  Please verify your payment information and try again.',
        buttons: ['Dismiss']
      })
    })
  );

  @Effect()
  reloadSubscriber$ = this.actions$.pipe(
    ofType(PurchaseItemSuccessAction.type),
    map(() => {
      this.dialog.open({
        title: 'Success',
        message: 'Your purchase was successful.',
        buttons: ['Close']
      }).onClose.subscribe(() => {
        this.store.dispatch(new BackAction('/user/wallet'));
      });

      return new LoadSubscriberAction();
    })
  );
  @Effect()
  loadCountries$ = this.actions$.pipe(
    ofType<RouterNavigationAction<SerializedRoute>>(ROUTER_NAVIGATION),
    map(e => e.payload.routerState),
    filter(state => !!state.component && BaseAddMoneyComponent.isPrototypeOf(state.component)), // the route has the add money
    mergeMap(state => {
      return this.subscriberService.getCountries().pipe(
        map(countries => {
          return new LoadCountriesSuccessAction(countries);
        })
      );
    })
  );

  @Effect()
  loadBillingAddresses$ = this.actions$.pipe(
    ofType(LoadBillingAddressesAction.type),
    mergeMap(() => this.subscriberService.getEmailsAndAddresses()),
    resultMap(resp => resp.addresses),
    resultMap(addresses => addresses.filter(address => address.type === 'BILLING')),
    resultMap(addresses => new LoadBillingAddressesSuccessAction(addresses)),
    elseMap(err => new LoadBillingAddressesFailAction(err)) // TODO: handle this error
  );

  @Effect()
  loadBankAccounts$ = this.actions$.pipe(
    ofType(LoadBankAccountsAction.type),
    mergeMap(() => this.paymentService.loadBankAccounts()),
    resultMap(accounts => new LoadBankAccountsSuccessAction(accounts)),
    elseMap(err => new LoadBankAccountsFailAction(err))
  );

  @Effect()
  withdrawMoney$ = this.actions$.pipe(
    ofType<WithdrawMoneyAction>(WithdrawMoneyAction.type),
    mergeMap((action) => this.paymentService.withdrawUsingEcheck(action.payload.echeck, action.payload.amount)),
    resultMergeMap(() => {
        return [new WithdrawMoneySuccessAction(), new LoadSubscriberAction()];
    }),
    elseMap(err => new WithdrawMoneyFailAction(err))
  );

  @Effect()
  withdrawMoneySuccess$ = this.actions$.pipe(
    ofType(WithdrawMoneySuccessAction.type),
    switchMap(() => {
      return this.dialog.open({
        title: 'Success!',
        message: 'Your withdrawal was successful.',
        buttons: ['Dismiss']
      }).onClose;
    }),
    map(() => new BackAction('/user/wallet'))
  );

  @Effect({dispatch: false})
  withdrawMoneyFail$ = this.actions$.pipe(
    ofType<WithdrawMoneyFailAction>(WithdrawMoneyFailAction.type),
    tap(e => {
      this.httpErrorHandler.handleError(e.payload, {}, 'Unable to withdraw, please verify your information is correct and try again.');
    })
  );

  @Effect()
  redeemCoupon$ = this.actions$.pipe(
    ofType<RedeemCouponAction>(RedeemCouponAction.type),
    mergeMap((action) => this.paymentService.redeemCoupon(action.payload)),
    resultMergeMap(() => [new RedeemCouponSuccessAction(), new LoadSubscriberAction()]),
    elseMap(e => new RedeemCouponFailAction(e))
  );

  @Effect()
  redeemCouponSuccess$ = this.actions$.pipe(
    ofType<RedeemCouponSuccessAction>(RedeemCouponSuccessAction.type),
    switchMap(() => {
      return this.dialog.open({
        title: 'Success!',
        message: 'Successfully redeemed coupon.',
        buttons: ['Dismiss']
      }).onClose;
    }),
    map(() => new BackAction('/user/wallet'))
  );

  @Effect({dispatch: false})
  redeemCouponFail$ = this.actions$.pipe(
    ofType<RedeemCouponFailAction>(RedeemCouponFailAction.type),
    tap(action => {
      this.httpErrorHandler.handleError(action.payload, {
        couponAlreadyRedeemed: 'This coupon has already been redeemed.',
        couponCancelled: 'This coupon is no longer valid.',
        couponExpired: 'This coupon has expired.'
      }, 'Invalid coupon code.  Please try again.');
    })
  );

  constructor(
    private actions$: Actions,
    private paymentService: BasePaymentService,
    private dialog: BaseDialogService,
    private store: Store<AppState>,
    private subscriberService: BaseSubscriberService,
    private log: LogService,
    private httpErrorHandler: HttpErrorHandler
  ) {
  }
}
