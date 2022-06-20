import {ReferredSubscriber} from '@snowl/base-app/model/referred-subscriber';
import {ReferralTransaction} from '@snowl/base-app/model/referral-transaction';
import {
  AffiliateActions,
  LoadReferralInfoAction, LoadReferralInfoFailAction,
  LoadReferralInfoSuccessAction
} from '@snowl/home-store/actions/affiliate.actions';

export interface AffiliateState {
  referredSubscribers: ReferredSubscriber[];
  referralTransactions: ReferralTransaction[];
  loadingReferralInfo: boolean;
}

const defaultState: AffiliateState = {
  referredSubscribers: [],
  referralTransactions: [],
  loadingReferralInfo: false
};

export function affiliateReducer(state = defaultState, action: AffiliateActions): AffiliateState {
  switch (action.type) {
    case LoadReferralInfoAction.type:
      return {
        ...state,
        loadingReferralInfo: true
      };
    case LoadReferralInfoSuccessAction.type:
      return {
        ...state,
        referralTransactions: action.referralTransactions,
        referredSubscribers: action.referredSubscribers,
        loadingReferralInfo: false
      };
    case LoadReferralInfoFailAction.type:
      return {
        ...state,
        loadingReferralInfo: false
      };
    default:
      return state;
  }
}
