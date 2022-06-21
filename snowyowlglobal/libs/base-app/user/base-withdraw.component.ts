import {Injectable, OnDestroy, OnInit} from "@angular/core";
import { select, Store } from '@ngrx/store';
import {getIsLoadingSubscriber, getSubscriber} from "@snowl/app-store/selectors";
import {BackAction, LoadSubscriberAction} from "@snowl/app-store/actions";
import {Observable, Subject} from "rxjs";
import {EcheckForm, Subscriber} from "@snowl/base-app/model";
import {filter, take, takeUntil} from "rxjs/operators";
import {getValue, parseNumber} from "@snowl/base-app/util";
import {WithdrawMoneyAction} from "@snowl/user-store/actions/wallet.actions";
import {getBankAccounts, getBillingAddresses, getCountries, getIsWithdrawingMoney} from "@snowl/user-store/selectors";
import {BaseDialogService} from "@snowl/base-app/shared";

@Injectable()
export class BaseWithdrawComponent implements OnInit, OnDestroy {
  subscriber$ = this.store.pipe(select(getSubscriber));
  loading$ = this.store.pipe(select(getIsLoadingSubscriber));
  isWithdrawingMoney$ = this.store.pipe(select(getIsWithdrawingMoney));
  countries$ = this.store.pipe(select(getCountries));
  bankAccounts$ = this.store.pipe(select(getBankAccounts));
  billingAddresses$ = this.store.pipe(select(getBillingAddresses));

  echeck = new EcheckForm();

  amount: string;

  get amountNumber(): number {
    return parseNumber(this.amount);
  }

  protected onDestroy$ = new Subject();
  constructor (protected store: Store<any>, private dialog: BaseDialogService) {
  }

  ngOnInit(): void {
    this.isWithdrawingMoney$.pipe(takeUntil(this.onDestroy$)).subscribe(requesting => {
      if (requesting) {
        this.dialog.showLoadingIndicator('Withdrawing Money...');
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

  withdraw(): void {
    this.store.dispatch(new WithdrawMoneyAction({echeck: this.echeck, amount: this.amountNumber}));
  }

  refreshMe(callback: () => void): void {
    const subscriber = getValue(this.subscriber$);
    if (subscriber && subscriber.subscriberId) {
      this.store.dispatch(new LoadSubscriberAction());
      this.loading$.pipe(filter(bool => !bool), take(1)).subscribe(() => callback());
    } else {
      callback();
    }
  }
}
