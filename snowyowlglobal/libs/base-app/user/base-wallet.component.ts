import { canNavigateBack, getIsLoadingSubscriber, getSubscriber } from '@snowl/app-store/selectors';
import { Store, select } from '@ngrx/store';
import { AppState } from '@snowl/app-store/reducers';
import { BackAction, LoadSubscriberAction } from '@snowl/app-store/actions';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { filter, take, takeUntil } from 'rxjs/operators';
import { getValue } from '@snowl/base-app/util';
import { BaseDialogService } from '@snowl/base-app/shared';
import { geteditingError, geteditingState, getIsUploadingImage } from '@snowl/user-store/selectors';
import { Subject } from 'rxjs';
import { UpdateUserAction, UploadProfileImageAction } from '@snowl/user-store/actions';
import { Subscriber } from '@snowl/base-app/model';

@Injectable()
export abstract class BaseWalletComponent implements OnInit, OnDestroy {
  subscriber$ = this.store.pipe(select(getSubscriber));

  onDestroy$ = new Subject();
  constructor(protected store: Store<AppState>, private dialog: BaseDialogService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  goBack(): void {
    this.store.dispatch(new BackAction('/user'));
  }
}
