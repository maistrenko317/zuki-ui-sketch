import {Action} from '@ngrx/store';
import {ReferredSubscriber} from '@snowl/base-app/model/referred-subscriber';
import {ReferralTransaction} from '@snowl/base-app/model/referral-transaction';
import {ShoutErrorResponse} from '@snowl/base-app/error';
import {LoadReferralInfoResponse} from '@snowl/base-app/home';

const LOAD_REFERRAL_INFO = "[Home/Affiliate] Load Referral Info";
const LOAD_REFERRAL_INFO_SUCCESS = "[Home/Affiliate] Load Referral Info Success";
const LOAD_REFERRAL_INFO_FAIL = "[Home/Affiliate] Load Referral Info Fail";

export class LoadReferralInfoAction implements Action {
  static readonly type = LOAD_REFERRAL_INFO;
  readonly type = LOAD_REFERRAL_INFO;
}

export class LoadReferralInfoSuccessAction implements Action {
  static readonly type = LOAD_REFERRAL_INFO_SUCCESS;
  readonly type = LOAD_REFERRAL_INFO_SUCCESS;

  constructor(public referredSubscribers: ReferredSubscriber[], public referralTransactions: ReferralTransaction[]) {

  }
}

export class LoadReferralInfoFailAction implements Action {
  static readonly type = LOAD_REFERRAL_INFO_FAIL;
  readonly type = LOAD_REFERRAL_INFO_FAIL;

  constructor(public payload: ShoutErrorResponse<LoadReferralInfoResponse>) {
  }
}


export type AffiliateActions =
  LoadReferralInfoAction
  | LoadReferralInfoFailAction
  | LoadReferralInfoSuccessAction;
