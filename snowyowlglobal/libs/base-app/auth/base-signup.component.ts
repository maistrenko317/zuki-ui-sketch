import {select, Store} from '@ngrx/store';
import {AppState, SignupForm} from '@snowl/app-store/reducers';
import {
  BackAction,
  GoAction,
  SetLocalStorageAction,
  SignupAction,
  UpdateSignupFormAction
} from '@snowl/app-store/actions';
import {AfterViewInit, ChangeDetectorRef, ElementRef, Injectable, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BaseDialogService} from '@snowl/base-app/shared';
import {getCanSeeContentWithoutLogin, getIsSigningUp, getRouterState, getSignupForm} from '@snowl/app-store/selectors';
import {Subscription} from 'rxjs';
import {getValue} from '../util';
import {states} from '@snowl/base-app/user';
import {differenceInYears} from "date-fns";
import {NgForm} from "@angular/forms";

@Injectable()
export abstract class BaseSignupComponent implements OnInit, OnDestroy, AfterViewInit {
  states = states;

  canSeeContentWithoutLoggingIn$ = this.store.pipe(select(getCanSeeContentWithoutLogin));

  abstract nextRoute: string[];

  protected subscription: Subscription;

  @ViewChild('input', {static: false}) input?: ElementRef | any;

  constructor(protected store: Store<AppState>, protected dialog: BaseDialogService, protected cdr: ChangeDetectorRef) {
    const signupForm = getValue(this.store.pipe(select(getSignupForm)));

    this._birthDate = signupForm.birthDate!;
    this._nickname = signupForm.nickname!;
    this._password = signupForm.password!;
    this._passwordConf = signupForm.passwordConf!;
    this._email = signupForm.email!;
    this._lastName = signupForm.lastName!;
    this._firstName = signupForm.firstName!;
    this._isAdult = signupForm.isAdult!;
    this._state = signupForm.region;

    setTimeout(() => {
      // Kludge until this is fixed: https://github.com/angular/angular/issues/10816
      this.cdr.markForCheck();
    }, 100)
  }

  private _email: string;

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
    this.updateStore('email', value);
  }

  private _password: string;

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
    this.updateStore('password', value);
  }

  private _birthDate: Date;

  get birthDate(): Date {
    return this._birthDate;
  }

  set birthDate(value: Date) {
    this._birthDate = value;
    this.updateStore('birthDate', value);
  }

  private _nickname: string;

  get nickname(): string {
    return this._nickname;
  }

  set nickname(value: string) {
    this._nickname = value;
    this.updateStore('nickname', value);
  }

  private _passwordConf = '';

  get passwordConf(): string {
    return this._passwordConf;
  }

  set passwordConf(value: string) {
    this._passwordConf = value;
    this.updateStore('passwordConf', value);
  }

  private _firstName = '';

  get firstName(): string {
    return this._firstName;
  }

  set firstName(val: string) {
    this._firstName = val;
    this.updateStore('firstName', val);
  }

  private _lastName = '';

  get lastName(): string {
    return this._lastName;
  }

  set lastName(val: string) {
    this._lastName = val;
    this.updateStore('lastName', val);
  }

  private _isAdult = false;

  get isAdult(): boolean {
    return this._isAdult;
  }

  set isAdult(val: boolean) {
    this._isAdult = val;
    this.updateStore('isAdult', val);
  }

  private _state?: string;

  get state(): string | undefined {
    return this._state;
  }

  set state(val: string | undefined) {
    this._state = val;
    this.updateStore('region', val);
  }

  get ageToBe(): number {
    let ageToBe = 18; // TODO: get from server call
    if (this.state === 'NE' || this.state === 'AL') {
      ageToBe = 19;
    } else if (this.state === 'MA') {
      ageToBe = 21;
    }
    return ageToBe;
  }

  get isBirthdayOldEnough(): boolean {
    if (!this.birthDate)
      return false;

    const age = differenceInYears(new Date(), this.birthDate);
    const ageToBe = this.ageToBe;

    return age >= ageToBe;
  }

  ngAfterViewInit(): void {
    this.focus();
  }

  ngOnInit(): void {
    this.subscription = this.store.pipe(select(getIsSigningUp)).subscribe(loggingIn => {
      if (loggingIn) {
        this.dialog.showLoadingIndicator('Signing up...');
      } else {
        this.dialog.closeLoadingIndicator();
      }
    });

    const routerState = getValue(this.store.pipe(select(getRouterState)));
    if (routerState.state && routerState.state.queryParams && routerState.state.queryParams.r) {
      this.store.dispatch(new SetLocalStorageAction({referralNickname: routerState.state.queryParams.r}));
    }

  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    this.dialog.closeLoadingIndicator();
  }

  signup(): void {
    this.store.dispatch(new SignupAction());
  }

  goBack(): void {
    const canSee = getValue(this.canSeeContentWithoutLoggingIn$);
    this.store.dispatch(new BackAction(canSee ? '/home/me' : '/auth/login'));
  }

  updateStore<T extends keyof SignupForm>(key: T, value: SignupForm[T]): void {
    this.store.dispatch(new UpdateSignupFormAction({
      [key]: value
    }));
  }

  goNext(form?: NgForm): void {
    if (form && !form.valid)
      return;

    this.store.dispatch(new GoAction(this.nextRoute));
  }

  focus(): void {
    if (!this.input)
      return;
    if (this.input.nativeElement)
      this.input.nativeElement.focus();
    else if (this.input.focus)
      this.input.focus();
  }
}
