import {Injectable, InjectionToken} from "@angular/core";
import {select, Store} from "@ngrx/store";
import {getIsLoadingSubscriber, getSubscriber} from "@snowl/app-store/selectors";
import {BackAction} from "@snowl/app-store/actions";
import {filter, map} from "rxjs/operators";
import {Subscriber, SubscriberNotificationPreference} from "@snowl/base-app/model";
import {getValue, parseNumber} from "@snowl/base-app/util";
import {
  SendPhoneVerificationCodeAction,
  UpdateNotificationPrefAction,
  VerifyPhoneNumberAction
} from "@snowl/user-store/actions";

@Injectable()
export class BaseNotificationPrefsComponent {
  loadingSub$ = this.store.pipe(select(getIsLoadingSubscriber))
  subscriber$ = this.store.pipe(select(getSubscriber));
  preference$ = this.subscriber$.pipe(
    filter((sub): sub is Subscriber => !!sub),
    map(sub => sub.notificationPreference)
  );

  newVal?: SubscriberNotificationPreference;
  phoneNumber?: string;
  verificationCode = '';

  constructor(protected store: Store<any>) {

  }

  goBack(): void {
    this.store.dispatch(new BackAction('/user'));
  }

  save(): void {
    this.store.dispatch(new UpdateNotificationPrefAction(this.newVal!));
    this.goBack();
  }

  selectPref(pref: SubscriberNotificationPreference): void {
    const savedVal = getValue(this.preference$);
    this.newVal = pref === savedVal ? undefined : pref;
  }

  sendCode(): void {
    this.store.dispatch(new SendPhoneVerificationCodeAction(parseNumber(this.phoneNumber!)));
  }

  verify(): void {
    this.store.dispatch(new VerifyPhoneNumberAction(parseNumber(this.verificationCode)));
  }
}
