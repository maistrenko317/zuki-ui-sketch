import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from "@angular/core";
import {BaseSignupComponent} from "@snowl/base-app/auth";
import { select, Store } from '@ngrx/store';
import {AppState} from "@snowl/app-store/reducers";
import {BaseDialogService} from "@snowl/base-app/shared";
import {Actions, ofType} from '@ngrx/effects';
import {getIsDeviceMobile} from "../../shared/store/selectors/device.selectors";

@Component({
  templateUrl: './signup-email.component.html',
  styleUrls: ['../login-signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupEmailComponent extends BaseSignupComponent {
  isMobile$ = this.store.pipe(select(getIsDeviceMobile));

  nextRoute = ['/auth/signup-nickname'];

  constructor(store: Store<AppState>, dialog: BaseDialogService, cdr: ChangeDetectorRef) {
    super(store, dialog, cdr);
  }
}
