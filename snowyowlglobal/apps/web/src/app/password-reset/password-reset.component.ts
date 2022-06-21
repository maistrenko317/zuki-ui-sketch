import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AppState} from '@snowl/app-store/reducers';
import {select, Store} from '@ngrx/store';
import {getRouterState} from '@snowl/app-store/selectors';
import {getValue} from '@snowl/base-app/util';
import {BackAction, GoAction} from '@snowl/app-store/actions';
import {BaseDialogService, BaseSubscriberService} from '@snowl/base-app/shared';
import {getIsDeviceMobile} from 'apps/web/src/app/shared/store/selectors/device.selectors';
import {LogService} from '@snowl/base-app/shared/services/log.service';

@Component({
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordResetComponent implements OnInit {
  password = '';

  isMobile$ = this.store.pipe(select(getIsDeviceMobile));
  private routerState$ = this.store.pipe(select(getRouterState));
  private resetPasswordCode: string;

  constructor(private store: Store<AppState>, private subscriberService: BaseSubscriberService,
              private dialog: BaseDialogService, private cdr: ChangeDetectorRef, private logger: LogService) {
  }

  ngOnInit(): void {
    const routerState = getValue(this.routerState$);
    if (!routerState.state || !routerState.state.queryParams) {
      this.store.dispatch(new BackAction('/home/me'));
      return;
    }

    this.resetPasswordCode = routerState.state.queryParams.prc;

    setTimeout(() => {
      // Because the ngform doesn't work well with push change detection
      this.cdr.detectChanges();
    }, 50)


  }

  goHome(): void {
    this.store.dispatch(new GoAction(['/home/me'], {clearHistory: true}));
  }

  resetPassword(): void {
    this.dialog.showLoadingIndicator('Resetting Password...');
    this.subscriberService.resetPassword(this.resetPasswordCode, this.password).subscribe((e) => {
      this.dialog.closeLoadingIndicator();

      this.dialog.open({
        title: 'Success!',
        message: 'Successfully Reset Password.',
        buttons: ['Dismiss']
      }).onClose.subscribe(() => {
        this.store.dispatch(new BackAction('/auth/login'));
      });
    }, (error) => {
      this.dialog.closeLoadingIndicator();
      this.dialog.open({
        title: 'Error',
        message: 'An unexpected error occurred trying to reset your password.  Please try again later.',
        buttons: ['Dismiss']
      });
      this.logger.error('Unexpected error resetting password: ', error);
    });
  }

}
