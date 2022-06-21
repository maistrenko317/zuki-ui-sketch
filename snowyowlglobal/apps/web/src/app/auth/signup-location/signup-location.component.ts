import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
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
  templateUrl: './signup-location.component.html',
  styleUrls: ['../login-signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupLocationComponent extends BaseSignupComponent implements OnInit, OnDestroy {
  isMobile$ = this.store.pipe(select(getIsDeviceMobile));

  nextRoute = ['/auth/signup-birthday'];

  constructor(store: Store<AppState>, dialog: BaseDialogService, cdr: ChangeDetectorRef) {
    super(store, dialog, cdr);

    if (!this.nickname) {
      this.store.dispatch(new BackAction('/auth/signup-nickname'))
    }
  }

  ngOnInit(): void {
    super.ngOnInit();
    // kludge to get the menu to look right
    document.body.className = "bg-main";
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();

    document.body.className = "";
  }
}
