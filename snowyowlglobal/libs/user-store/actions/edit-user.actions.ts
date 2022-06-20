import {Action} from '@ngrx/store';
import {Subscriber, SubscriberNotificationPreference} from '@snowl/base-app/model';

const UPLOAD_PROFILE_IMG = '[User] Upload Profile Image';
const UPLOAD_PROFILE_IMG_FAIL = '[User] Upload Profile Image Fail';
const UPLOAD_PROFILE_IMG_SUCCESS = '[User] Upload Profile Image Success';

export class UploadProfileImageAction implements Action {
  static readonly type = UPLOAD_PROFILE_IMG;
  readonly type = UPLOAD_PROFILE_IMG;

  constructor(public payload: any) {
  }
}

export class UploadProfileImageSuccessAction implements Action {
  static readonly type = UPLOAD_PROFILE_IMG_SUCCESS;
  readonly type = UPLOAD_PROFILE_IMG_SUCCESS;
}

export class UploadProfileImageFailAction implements Action {
  static readonly type = UPLOAD_PROFILE_IMG_FAIL;
  readonly type = UPLOAD_PROFILE_IMG_FAIL;

  constructor(public payload: any) {
  }
}

const UPDATE_USER = '[User] Update User';
const UPDATE_USER_SUCCESS = '[User] Update User Success';
const UPDATE_USER_FAIL = '[User] Update User Fail';

export class UpdateUserAction implements Action {
  static readonly type = UPDATE_USER;
  readonly type = UPDATE_USER;

  constructor(public payload: Partial<Subscriber>, public successActions: Action[] = [], public debounce = true) {
  }
}

export class UpdateUserFailAction implements Action {
  static readonly type = UPDATE_USER_FAIL;
  readonly type = UPDATE_USER_FAIL;

  constructor(public payload: any, public message?: string) {
  }
}

export class UpdateUserSuccessAction implements Action {
  static readonly type = UPDATE_USER_SUCCESS;
  readonly type = UPDATE_USER_SUCCESS;
}

const SEND_PHONE_VERIFICATION_CODE = '[User] Sending phone verification code';

export class SendPhoneVerificationCodeAction implements Action {
  static readonly type = SEND_PHONE_VERIFICATION_CODE;
  readonly type = SEND_PHONE_VERIFICATION_CODE;

  constructor(public payload: number) {

  }
}

const VERIFY_PHONE_NUMBER = '[User] Verify phone number';
const VERIFY_PHONE_NUMBER_RESPONSE = '[User] Verify phone number response';

export class VerifyPhoneNumberAction implements Action {
  static readonly type = VERIFY_PHONE_NUMBER;
  readonly type = VERIFY_PHONE_NUMBER;

  constructor(public payload: number) {

  }
}


export class VerifyPhoneNumberResponseAction implements Action {
  static readonly type = VERIFY_PHONE_NUMBER_RESPONSE;
  readonly type = VERIFY_PHONE_NUMBER_RESPONSE;

  constructor(public payload: boolean) {

  }
}

const UPDATE_NOTIFICATION_PREF = '[User] Update notification pref';
const UPDATE_NOTIFICATION_PREF_RESPONSE = '[User] Update notification pref Resposne';
export class UpdateNotificationPrefAction implements Action {
  static readonly type = UPDATE_NOTIFICATION_PREF;
  readonly type = UPDATE_NOTIFICATION_PREF;

  constructor (public payload: SubscriberNotificationPreference) {

  }
}
export class UpdateNotificationPrefResponseAction implements Action {
  static readonly type = UPDATE_NOTIFICATION_PREF_RESPONSE;
  readonly type = UPDATE_NOTIFICATION_PREF_RESPONSE;
}

export type EditUserActions =
  | UploadProfileImageAction
  | UploadProfileImageFailAction
  | UploadProfileImageSuccessAction
  | UpdateUserAction
  | UpdateUserFailAction
  | UpdateUserSuccessAction
  | SendPhoneVerificationCodeAction
  | VerifyPhoneNumberAction
  | VerifyPhoneNumberResponseAction
  | UpdateNotificationPrefAction
  | UpdateNotificationPrefResponseAction;
