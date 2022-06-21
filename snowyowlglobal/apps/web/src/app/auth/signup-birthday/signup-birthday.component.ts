import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {BaseSignupComponent} from "@snowl/base-app/auth";
import { select, Store } from '@ngrx/store';
import {AppState} from "@snowl/app-store/reducers";
import {BaseDialogService} from "@snowl/base-app/shared";
import {Actions, ofType} from '@ngrx/effects';
import {getIsDeviceMobile} from "../../shared/store/selectors/device.selectors";
import {fillArray, getMonthName} from "@snowl/base-app/util";
import {getDaysInMonth} from "date-fns";
import {BackAction} from "@snowl/app-store/actions";

@Component({
  templateUrl: './signup-birthday.component.html',
  styleUrls: ['../login-signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupBirthdayComponent extends BaseSignupComponent implements OnInit, OnDestroy {
  isMobile$ = this.store.pipe(select(getIsDeviceMobile));

  nextRoute = ['/auth/signup-pass'];

  get year(): number {
    return this._year;
  }

  set year(value: number) {
    this._year = value;
  }

  years = fillArray(101, new Date().getFullYear() - 100);
  months = fillArray(12);
  getMonthName = getMonthName;
  day = 1;
  private _year = new Date().getFullYear() - 20;

  private startOfDay = new Date().setHours(0, 0, 0, 0);

  constructor(store: Store<AppState>, dialog: BaseDialogService, cdr: ChangeDetectorRef) {
    super(store, dialog, cdr);

    if (this.birthDate) {
      this.year = this.birthDate.getFullYear();
      this.month = this.birthDate.getMonth();
      this.day = this.birthDate.getDate();
    } else {
      this.setBirthdate();
    }

    if (!this.state) {
      this.store.dispatch(new BackAction('/auth/signup-location'))
    }
  }

  private _month = 0;

  get month(): number {
    return this._month;
  }

  set month(value: number) {
    this._month = value;
    this.day = 1;
  }

  private _days: number[] = [];

  get days(): number[] {
    if (!this._days) return [];

    const days = getDaysInMonth(new Date(this._year, this._month));
    if (this._days.length !== days) {
      this._days = fillArray(days, 1);
    }
    return this._days;
  }

  isInFuture(month: number, day: number, year: number) {
    return new Date(year, month, day).getTime() > this.startOfDay;
  }

  setBirthdate(): void {
    this.birthDate = new Date(this.year, this.month, this.day);
  }

  ngOnInit(): void {
    super.ngOnInit();
    document.body.className = "bg-main";
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    document.body.className = "";
  }
}
