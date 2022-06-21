import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '@snowl/app-store/reducers';

export const getAuthState = createFeatureSelector<AuthState>('auth');
export const getSubscriber = createSelector(getAuthState, state => state.subscriber);
export const getIsLoggedIn = createSelector(getAuthState, state => !!state.sessionKey);

export const getIsLoggingIn = createSelector(getAuthState, state => state.loggingIn);
export const getIsSigningUp = createSelector(getAuthState, state => state.signingUp);
export const getSessionKey = createSelector(getAuthState, state => state.sessionKey);
export const getIsLoadingSubscriber = createSelector(getAuthState, state => state.loadingSubscriber);
export const getSubscriberGames = createSelector(getAuthState, state => state.subscriberGames);
export const getIsLoadingSubscriberGames = createSelector(getAuthState, state => state.loadingSubscriberGames);

export const getSignupForm = createSelector(getAuthState, state => state.signupForm);

export const getIsCheckingNickname = createSelector(getAuthState, state => state.checkingNickname);
export const getIsNicknameValid = createSelector(getAuthState, state => state.validNickname);
