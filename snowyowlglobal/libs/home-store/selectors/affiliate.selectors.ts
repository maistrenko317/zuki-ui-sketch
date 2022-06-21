import {createSelector} from '@ngrx/store';
import {getHomeState} from '@snowl/home-store/reducers';

export const getAffiliateState = createSelector(getHomeState, s => s.affiliate);

export const getLoadingReferralInfo = createSelector(getAffiliateState, s => s.loadingReferralInfo);

export const getReferredSubscribers = createSelector(getAffiliateState, s => s.referredSubscribers);
export const getReferralTransactions = createSelector(getAffiliateState, s => s.referralTransactions);
