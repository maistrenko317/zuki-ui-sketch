import { ShoutErrorResponse } from '../error';
import { BaseDialogService } from '@snowl/base-app/shared';
import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { LogoutAction } from '@snowl/app-store/actions';
import { AppState } from '@snowl/app-store/reducers';
import {LogService} from "@snowl/base-app/shared/services/log.service";
import {ShoutResponse, ShoutResponseErrors} from '@snowl/base-app/model';

@Injectable()
export class HttpErrorHandler {
  private GLOBAL_ERRORS: HANDLED_ERRORS<ShoutResponse> = {
    subscriberNotFound: {
      message: 'Session Expired.  Please log back in.',
      action: new LogoutAction(),
      button: 'Logout'
    }
  };

  constructor(protected dialog: BaseDialogService, protected store: Store<AppState>, protected logger: LogService) {}

  handleError<T extends ShoutResponse>(error: ShoutErrorResponse<T>, messages: HANDLED_ERRORS<T>, defaultMessage: string): void {
    const { message, action, button } = this.getHandledMessage(error, messages, defaultMessage);
    this.logger.log('Handled Exception: ', error, 'With Message: ', message);
    this.dialog.open({
      message: message,
      title: 'Error',
      buttons: [button || 'Dismiss']
    }).onClose.subscribe(() => {
      if (action) {
        this.store.dispatch(action);
      }
    });
  }

  getHandledMessage<T extends ShoutResponse>(error: ShoutErrorResponse<T>, messages: HANDLED_ERRORS<T>, defaultMessage: string): HandledError<T> {
    const m = {...this.GLOBAL_ERRORS, ...(messages as any)} as any;
    if (error instanceof ShoutErrorResponse) {
      const resp = error.response;

      for (const key in resp) {
        if (resp.hasOwnProperty(key) && resp[key] && m[key]) {
          const h = m[key];

          if (typeof h === 'object' && 'check' in h && !!h.check && !h.check(resp as any as T)) {
            continue;
          }

          return typeof h === 'string' ? { message: h } : (h! as HandledError<T>);
        }
      }
    }
    return {message: defaultMessage};
  }

  // handles(error: any): boolean {
  //   const {message} = this.getHandledMessage(error);
  //   return message !== this.DEFAULT_ERROR;
  // }
}

export type HANDLED_ERRORS<T extends ShoutResponse> = { [k in keyof ShoutResponseErrors<T>]?: string | HandledError<T> };

interface HandledError<T> {
  message: string;
  check?: (error: T) => boolean;
  button?: string;
  action?: Action;
}
