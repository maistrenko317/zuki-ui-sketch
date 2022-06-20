import {BaseForgotPasswordComponent} from '@snowl/base-app/auth';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {getIsDeviceMobile} from 'apps/web/src/app/shared/store/selectors/device.selectors';
import {select} from '@ngrx/store';

@Component({
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../login-signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordComponent extends BaseForgotPasswordComponent {
  isMobile$ = this.store.pipe(select(getIsDeviceMobile));
}
