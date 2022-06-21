import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {
  SendPhoneVerificationCodeAction, VerifyPhoneNumberAction, VerifyPhoneNumberResponseAction,
  UpdateUserAction,
  UpdateUserFailAction,
  UpdateUserSuccessAction,
  UploadProfileImageAction,
  UploadProfileImageFailAction,
  UploadProfileImageSuccessAction
} from '@snowl/user-store/actions';
import {buffer, catchError, debounceTime, filter, map, mergeMap, pluck, tap} from 'rxjs/operators';
import { BaseMediaService } from '@snowl/base-app/user';
import {
  BaseDialogService,
  BaseNotificationService,
  BaseSubscriberService,
  UpdateSubscriberResponse
} from '@snowl/base-app/shared';
import { of ,  Observable, NEVER } from 'rxjs';
import { AppState } from '@snowl/app-store/reducers';
import {Action, select, Store} from '@ngrx/store';
import {BackAction, LoadSubscriberAction, UpdateSubscriberAction} from '@snowl/app-store/actions';
import { Subscriber } from '@snowl/base-app/model';
import {getIsVerifyingCode} from "@snowl/user-store/selectors";
import {UpdateNotificationPrefAction} from "@snowl/user-store/actions/edit-user.actions";
import {LogService} from '@snowl/base-app/shared/services/log.service';
import {HttpErrorHandler} from '@snowl/base-app/error-handler';
import {elseMap, resultMergeMap} from 'ts-results/rxjs-operators';

@Injectable()
export class UserEffects {
  @Effect()
  uploadImage$ = this.actions$.pipe(
    ofType<UploadProfileImageAction>(UploadProfileImageAction.type),
    map(action => action.payload),
    filter(blob => !!blob),
    mergeMap(blob => {
      return this.mediaService.uploadImage(blob).pipe(
        map(uploadedUrl => {
          return new UpdateUserAction({ photoUrl: uploadedUrl }, [new UploadProfileImageSuccessAction()], false);
        }),
        catchError(err => of(new UploadProfileImageFailAction(err)))
      );
    })
  );

  @Effect()
  updateUserDebounced$ = this.actions$.pipe(
    ofType<UpdateUserAction>(UpdateUserAction.type),
    filter(action => action.debounce),
    buffer(this.actions$.pipe(ofType<UpdateUserAction>(UpdateUserAction.type), debounceTime(1500))),
    mergeMap((actions: UpdateUserAction[]) => {
      let sub: Partial<Subscriber> = {};
      const successActions: Action[] = [];
      actions.forEach(action => {
        sub = { ...sub, ...action.payload };
        successActions.push(...action.successActions);
      });
      return this.updateSub(sub, successActions);
    })
  );

  @Effect()
  updateUserNotDebounced$ = this.actions$.pipe(
    ofType<UpdateUserAction>(UpdateUserAction.type),
    filter(action => !action.debounce),
    mergeMap(action => {
      return this.updateSub(action.payload, action.successActions);
    })
  );

  @Effect({dispatch: false})
  sendPhoneVerificationCode$ = this.actions$.pipe(
    ofType<SendPhoneVerificationCodeAction>(SendPhoneVerificationCodeAction.type),
    mergeMap(action => {
      return this.notificationService.sendVerificationCode(action.payload); // TODO: what errors can happen here?
    })
  );

  @Effect()
  verifyPhoneCode$ = this.actions$.pipe(
    ofType<VerifyPhoneNumberAction>(VerifyPhoneNumberAction.type),
    mergeMap(action => {
      return this.notificationService.verifyCode(action.payload);
    }),
    map(success => {
      return new VerifyPhoneNumberResponseAction(success);
    })
  );

  @Effect({dispatch: false})
  verifyingPhoneCode$ = this.store.pipe(
    select(getIsVerifyingCode),
    tap(verifying => {
      if (verifying) {
        this.dialog.showLoadingIndicator('Verifying Code...');
      } else if (this.dialog.openLoadingIndicator === 'Verifying Code...') {
        this.dialog.closeLoadingIndicator();
      }
    })
  );

  @Effect()
  verifyCodeResponse$ = this.actions$.pipe(
    ofType<VerifyPhoneNumberResponseAction>(VerifyPhoneNumberResponseAction.type),
    mergeMap(resp => {
      if (resp.payload) {
        return [new UpdateNotificationPrefAction('SMS'), new BackAction('/user')];
      } else {
        this.dialog.open({
          title: 'Error',
          message: 'Unable to verify phone number',
          buttons: ['Dismiss']
        });

        return NEVER;
      }
    })
  );

  @Effect()
  updateNotificationPref$ = this.actions$.pipe(
    ofType<UpdateNotificationPrefAction>(UpdateNotificationPrefAction.type),
    mergeMap(action => {
      return this.notificationService.setNotificationPreference(action.payload); // TODO: what errors can happen here?
    }),
    map(() => new LoadSubscriberAction())
  );

  constructor(
    private actions$: Actions,
    private mediaService: BaseMediaService,
    private subscriberService: BaseSubscriberService,
    private notificationService: BaseNotificationService,
    private httpErrorHandler: HttpErrorHandler,
    private store: Store<AppState>,
    private dialog: BaseDialogService,
    private logger: LogService
  ) {}

  private updateSub(sub: Partial<Subscriber>, successActions: Action[] = []): Observable<Action> {
    return this.subscriberService.update({ ...sub }).pipe(
      resultMergeMap(() => [new UpdateUserSuccessAction(), new UpdateSubscriberAction(sub), ...successActions]),
      elseMap(err => {
        const { message } = this.httpErrorHandler.getHandledMessage<UpdateSubscriberResponse>(err, {
          nicknameAlreadyUsed: 'That nickname has already been used.',
          emailAlreadyUsed: 'That email has already been used.',
          nicknameInvalid: 'That nickname has already been used.' // TODO: what does this mean?
        }, 'An unexpected error occurred.  Please try again later.');

        this.logger.log('Handled an exception updating user!', err);
        return new UpdateUserFailAction(err, message);
      })
    );
  }
}
