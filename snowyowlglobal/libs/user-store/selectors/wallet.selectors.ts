import { createSelector } from '@ngrx/store';
import { getUserState } from '@snowl/user-store/reducers';

export const getWalletState = createSelector(getUserState, state => state.wallet);
export const getVenueItems = createSelector(getWalletState, state => state.venueItems);
export const getIsLoadingVenueItems = createSelector(getWalletState, state => state.loadingVenueItems);
export const getIsPurchasing = createSelector(getWalletState, state => state.purchasing);
export const getCountries = createSelector(getWalletState, state => state.countries);
export const getBillingAddresses = createSelector(getWalletState, state => state.billingAddresses);
export const getBankAccounts = createSelector(getWalletState, state => state.bankAccounts);
export const getIsWithdrawingMoney = createSelector(getWalletState, state => state.withdrawingMoney);
export const getCreditCards = createSelector(getWalletState, state => state.creditCards);
export const getIsRedeemingCoupon = createSelector(getWalletState, state => state.redeemingCoupon);
