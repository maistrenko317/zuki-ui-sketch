import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from "@angular/core";
import {BaseSignupComponent} from "@snowl/base-app/auth";
import { select, Store } from '@ngrx/store';
import {AppState} from "@snowl/app-store/reducers";
import {BaseDialogService} from "@snowl/base-app/shared";
import {Actions, ofType} from '@ngrx/effects';
import {getIsDeviceMobile} from "../../shared/store/selectors/device.selectors";
import {getIsCheckingNickname, getIsNicknameValid} from "@snowl/app-store/selectors";
import {combineLatest, zip} from "rxjs";
import {map} from "rxjs/operators";
import {BackAction} from "@snowl/app-store/actions";

@Component({
  templateUrl: './signup-nickname.component.html',
  styleUrls: ['../login-signup.component.scss'],
 // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupNicknameComponent extends BaseSignupComponent {
  isMobile$ = this.store.pipe(select(getIsDeviceMobile));

  isNicknameValid$ = this.store.pipe(select(getIsNicknameValid));
  isCheckingNickname$ = this.store.pipe(select(getIsCheckingNickname));

  canContinue$ = combineLatest(this.isNicknameValid$, this.isCheckingNickname$).pipe(
    map(([valid, checking]) => {
      console.log(valid, !checking);
      return valid && !checking;
    })
  );

  nextRoute = ['/auth/signup-location'];

  constructor(store: Store<AppState>, dialog: BaseDialogService, cdr: ChangeDetectorRef) {
    super(store, dialog, cdr);

    if (!this.email) {
      this.store.dispatch(new BackAction('/auth/signup'))
    }
  }
}
