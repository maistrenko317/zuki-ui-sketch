import { canNavigateBack, getIsLoadingSubscriber, getSubscriber } from '@snowl/app-store/selectors';
import { Store, select } from '@ngrx/store';
import { AppState } from '@snowl/app-store/reducers';
import { BackAction, LoadSubscriberAction } from '@snowl/app-store/actions';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { filter, take, takeUntil } from 'rxjs/operators';
import { getValue } from '@snowl/base-app/util';
import { BaseDialogService } from '@snowl/base-app/shared';
import {
  getBankAccounts,
  getBillingAddresses,
  getCountries,
  geteditingError,
  geteditingState,
  getIsLoadingVenueItems,
  getIsPurchasing,
  getIsUploadingImage,
  getVenueItems,
  getCreditCards
} from '@snowl/user-store/selectors';
import { Subject } from 'rxjs';
import { UpdateUserAction, UploadProfileImageAction } from '@snowl/user-store/actions';
import { Subscriber, VenueItem } from '@snowl/base-app/model';
import { PaymentMethod } from '@snowl/base-app/user/index';
import { PurchaseItemAction } from '@snowl/user-store/actions/wallet.actions';

@Injectable()
export abstract class BaseAddMoneyComponent implements OnInit, OnDestroy {
  subscriber$ = this.store.pipe(select(getSubscriber));
  venueItems$ = this.store.pipe(select(getVenueItems));
  loadingVenueItems$ = this.store.pipe(select(getIsLoadingVenueItems));
  countries$ = this.store.pipe(select(getCountries));
  bankAccounts$ = this.store.pipe(select(getBankAccounts));
  billingAddresses$ = this.store.pipe(select(getBillingAddresses));
  creditCards$ = this.store.pipe(select(getCreditCards));

  purchasing$ = this.store.pipe(select(getIsPurchasing));

  onDestroy$ = new Subject();
  constructor(protected store: Store<AppState>, private dialog: BaseDialogService) {}

  ngOnInit(): void {
    this.purchasing$.pipe(takeUntil(this.onDestroy$)).subscribe(purchasing => {
      if (purchasing) {
        this.dialog.showLoadingIndicator('Purchasing...');
      } else {
        this.dialog.closeLoadingIndicator();
      }
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  goBack(): void {
    this.store.dispatch(new BackAction('/user/wallet'));
  }

  purchase(args: { method: PaymentMethod; item: VenueItem }) {
    this.store.dispatch(new PurchaseItemAction(args));
  }
}
