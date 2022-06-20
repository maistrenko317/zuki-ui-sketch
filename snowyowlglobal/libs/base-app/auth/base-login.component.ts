import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '@snowl/app-store/reducers';
import { BackAction, GoAction, LoginAction } from '@snowl/app-store/actions';
import { BaseDialogService } from '@snowl/base-app/shared';
import {canNavigateBack, getCanSeeContentWithoutLogin, getIsLoggingIn} from '@snowl/app-store/selectors';
import { take, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { getValue } from '../util';
import { Actions , ofType} from '@ngrx/effects';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import {environment} from '@snowl/environments/environment';

@Injectable()
export abstract class BaseLoginComponent implements OnInit, OnDestroy {
  email: string;
  password: string;

  canSeeContentWithoutLoggingIn$ = this.store.pipe(select(getCanSeeContentWithoutLogin));

  private subscription: Subscription;
  constructor(protected store: Store<AppState>, protected dialog: BaseDialogService) {}

  ngOnInit(): void {
    this.subscription = this.store.pipe(select(getIsLoggingIn)).subscribe(loggingIn => {
      if (loggingIn) {
        this.dialog.showLoadingIndicator('Logging in...');
      } else {
        this.dialog.closeLoadingIndicator();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    this.dialog.closeLoadingIndicator();
  }

  login(): void {
    this.store.dispatch(new LoginAction(this.email, this.password));
  }

  goToSignup(): void {
    this.store.dispatch(new GoAction(['/auth/signup']));
  }

  goBack(): void {
    this.store.dispatch(new BackAction('/home/me'));
  }
}
