import { canNavigateBack, getIsLoadingSubscriber, getSubscriber } from '@snowl/app-store/selectors';
import { Store, select } from '@ngrx/store';
import { AppState } from '@snowl/app-store/reducers';
import { BackAction, LoadSubscriberAction, LogoutAction } from '@snowl/app-store/actions';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { filter, take, takeUntil } from 'rxjs/operators';
import { getValue } from '@snowl/base-app/util';
import { BaseDialogService } from '@snowl/base-app/shared';
import { geteditingError, geteditingState, getIsUploadingImage } from '@snowl/user-store/selectors';
import { Subject } from 'rxjs';
import { UpdateUserAction, UploadProfileImageAction } from '@snowl/user-store/actions';
import { Subscriber } from '@snowl/base-app/model';

@Injectable()
export abstract class BaseEditMeComponent implements OnInit, OnDestroy {
  subscriber$ = this.store.pipe(select(getSubscriber));
  loading$ = this.store.pipe(select(getIsLoadingSubscriber));
  editingState$ = this.store.pipe(select(geteditingState));
  editingError$ = this.store.pipe(select(geteditingError));

  uploadingImage$ = this.store.pipe(select(getIsUploadingImage));

  onDestroy$ = new Subject();
  constructor(protected store: Store<AppState>, private dialog: BaseDialogService) {}

  ngOnInit(): void {
    this.uploadingImage$.pipe(takeUntil(this.onDestroy$)).subscribe(uploading => {
      if (uploading) {
        this.dialog.showLoadingIndicator('Uploading Image...');
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
    this.store.dispatch(new BackAction('/home/me'));
  }

  uploadImage(image: any): void {
    this.store.dispatch(new UploadProfileImageAction(image));
  }

  updateSubscriber(sub: Partial<Subscriber>): void {
    this.store.dispatch(new UpdateUserAction(sub));
  }

  logout(): void {
    this.store.dispatch(new LogoutAction());
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
