import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from "@angular/core";
import {BaseSignupComponent} from "@snowl/base-app/auth";
import { select, Store } from '@ngrx/store';
import {AppState} from "@snowl/app-store/reducers";
import {BaseDialogService} from "@snowl/base-app/shared";
import {Actions, ofType} from '@ngrx/effects';
import {getIsDeviceMobile} from "../../shared/store/selectors/device.selectors";
import {BackAction} from "@snowl/app-store/actions";

@Component({
  templateUrl: './signup-password.component.html',
  styleUrls: ['../login-signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupPasswordComponent extends BaseSignupComponent {
  isMobile$ = this.store.pipe(select(getIsDeviceMobile));

  nextRoute = ['/auth/signup-nickname'];

  constructor(store: Store<AppState>, dialog: BaseDialogService, cdr: ChangeDetectorRef) {
    super(store, dialog, cdr);

    if (!this.birthDate) {
      this.store.dispatch(new BackAction('/auth/signup-birthday'))
    }
  }
}
