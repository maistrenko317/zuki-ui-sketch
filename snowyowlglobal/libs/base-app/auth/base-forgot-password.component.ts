import {ChangeDetectorRef, Injectable} from '@angular/core';
import {BaseDialogService, BaseSubscriberService} from '@snowl/base-app/shared';
import {Store} from '@ngrx/store';
import {AppState} from '@snowl/app-store/reducers';
import {BackAction} from '@snowl/app-store/actions';

@Injectable()
export abstract class BaseForgotPasswordComponent {
  email: string;

  constructor(protected store: Store<AppState>, protected subscriberService: BaseSubscriberService, protected cdr: ChangeDetectorRef, protected dialog: BaseDialogService) {
    setTimeout(() => {
      // Kludge until this is fixed: https://github.com/angular/angular/issues/10816
      this.cdr.markForCheck();
    }, 100)
  }

  goBack(): void {
    this.store.dispatch(new BackAction('/auth/login'));
  }

  requestReset(): void {
    this.dialog.showLoadingIndicator('Requesting Password Reset...');
    this.subscriberService.requestResetPassword(this.email).subscribe((resp) => {
      this.dialog.closeLoadingIndicator();
      this.dialog.open({
        title: resp ? 'Sent' : 'Error',
        message: resp ? `We've sent an email with reset instructions.` : 'An unexpected error occurred. please try again later',
        buttons: ['Dismiss']
      });

      this.cdr.markForCheck();
    });
  }
}
