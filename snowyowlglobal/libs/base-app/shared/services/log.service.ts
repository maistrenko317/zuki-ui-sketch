import {Inject, Injectable, InjectionToken} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import { select, Store } from '@ngrx/store';
import {getDeviceId, getSubscriber} from "@snowl/app-store/selectors";
import {getValue} from "@snowl/base-app/util";
import {PLATFORM} from "@snowl/base-app/tokens";
import {environment} from '@snowl/environments/environment';

const logglyToken = 'e0d4bdaa-d75d-49c1-b013-c847da098c7d';

@Injectable()
export class LogService {
  private sub = this.store.pipe(select(getSubscriber));
  private device = this.store.pipe(select(getDeviceId));

  constructor(private http: HttpClient, private store: Store<any>, @Inject(PLATFORM) private client: string) {
  }

  log(...args: any[]) {
    this.sendMessage('log', args);
    console.log(...args);
  }

  error(...args: any[]) {
    this.sendMessage('error', args);
    console.error(...args);
  }

  debug(...args: any[]) {
    this.sendMessage('debug', args);
    console.log(...args);
  }

  sendError(...args: any[]) {
    this.sendMessage('error', args);
  }

  private sendMessage(level: string, args: any[]): void {
    if (!environment.production)
      return;

    const sub = getValue(this.sub);
    const body: any = {
      level,
      sub: sub ? {id: sub.subscriberId, email: sub.email, nickname: sub.nickname} : {id: -1, email: 'NOT_SIGNED_IN', nickname: 'NOT_SIGNED_IN'},
      device: getValue(this.device),
      client: this.client
    };

    let logString = '';
    let idx = 0;
    args.forEach(arg => {
      logString += ' ';
      if (typeof arg === 'object' && !(arg instanceof Date)) {
        logString += `$${idx}`;
        body[`$${idx}`] = arg;
        idx++;
      } else {
        logString += arg;
      }
    });
    body.message = logString;

    this.http.post(`https://logs-01.loggly.com/inputs/${logglyToken}/tag/http/`, JSON.stringify(body)).subscribe(() => {
      console.log('Sent message to loggly');
    });
  }
}

export function enableErrorLogging(): void {
  Object.defineProperty(Error.prototype, 'toJSON', {
    value: function () {
      const alt: any = {};

      Object.getOwnPropertyNames(this).forEach(function (this: any, key) {
        alt[key] = this[key];
      }, this);

      return alt;
    },
    configurable: true,
    writable: true
  });
}
