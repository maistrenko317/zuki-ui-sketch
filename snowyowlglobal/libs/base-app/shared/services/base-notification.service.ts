import {Injectable} from '@angular/core';
import {BaseHttpService} from './base-http.service';
import {Observable} from 'rxjs';
import {ShoutResponse, SubscriberNotificationPreference} from '@snowl/base-app/model';
import {LogService} from "./log.service";
import {Result} from 'ts-results';
import {ShoutErrorResponse} from '@snowl/base-app/error';
import {elseMapTo, resultMap} from 'ts-results/rxjs-operators';

@Injectable()
export class BaseNotificationService {
  constructor(protected http: BaseHttpService, protected logService: LogService) {
  }

  sendVerificationCode(phone: number): Observable<Result<ShoutResponse, ShoutErrorResponse>> {
    return this.http.sendCollectorRequest('/snowl/phone/sendVerificationCode', {phone});
  }

  verifyCode(code: number): Observable<boolean> {
    // TODO: should I handle errors here, or is this good enough?
    return this.http.sendCollectorRequest('/snowl/phone/verifyCode', {code}).pipe(
      resultMap(resp => resp.success),
      elseMapTo(false)
    );
  }

  setNotificationPreference(pref: SubscriberNotificationPreference): Observable<Result<ShoutResponse, ShoutErrorResponse>> {
    return this.http.sendCollectorRequest('/snowl/notification/setPref', {prefValue: pref, prefType: 'ROUND_START'});
  }

  setPushToken(deviceToken: string): void {
    this.http.sendCollectorRequest('/subscriber/setPushToken', {deviceToken}).subscribe(() => {
      this.logService.log('Successfully set push token!');
    }, (error) => {
      this.logService.error('There was an error setting push token: ', error);
    });
  }

  registerForPush(): void { // Meant to be overriden in subclasses

  }
  deregisterForPush(): void { // Meant to be overriden in subclasses

  }
}

export interface PreferenceResponse extends ShoutResponse {
  prefs: { prefType: number; value: 'NONE' | 'SMS' | 'EMAIL' }[];
}
