import {Injectable, OnDestroy, OnInit} from "@angular/core";
import { select, Store } from '@ngrx/store';
import {getIsLoadingSubscriber, getSubscriber} from "@snowl/app-store/selectors";
import {BackAction, LoadSubscriberAction} from "@snowl/app-store/actions";
import {Observable, Subject} from "rxjs";
import {EcheckForm, Subscriber} from "@snowl/base-app/model";
import {filter, take, takeUntil} from "rxjs/operators";
import {getValue, parseNumber} from "@snowl/base-app/util";
import {RedeemCouponAction, WithdrawMoneyAction} from "@snowl/user-store/actions/wallet.actions";
import {
  getBankAccounts,
  getBillingAddresses,
  getCountries,
  getIsRedeemingCoupon,
  getIsWithdrawingMoney
} from "@snowl/user-store/selectors";
import {BaseDialogService} from "@snowl/base-app/shared";

@Injectable()
export class BaseRedeemComponent implements OnInit, OnDestroy {
  couponCode: string;
  private isRedeeming$ = this.store.pipe(select(getIsRedeemingCoupon));

  protected onDestroy$ = new Subject();
  constructor (protected store: Store<any>, private dialog: BaseDialogService) {
  }

  ngOnInit(): void {
    this.isRedeeming$.pipe(takeUntil(this.onDestroy$)).subscribe(redeeming => {
      if (redeeming) {
        this.dialog.showLoadingIndicator('Redeeming Coupon...');
      } else {
        this.dialog.closeLoadingIndicator();
      }
    })

  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  goBack(): void {
    this.store.dispatch(new BackAction('/user/wallet'));
  }

  redeem(): void {
    this.store.dispatch(new RedeemCouponAction(this.couponCode));
  }

}
