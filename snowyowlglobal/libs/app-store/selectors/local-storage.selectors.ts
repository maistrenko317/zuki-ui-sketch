import { LocalStorageState } from '../reducers';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const getLocalStorage = createFeatureSelector<LocalStorageState>('localStorage');
export const getDeviceId = createSelector(getLocalStorage, s => s.deviceId);
export const getSentFreeplayNotifications = createSelector(getLocalStorage, s => s.sentFreeplayNotifications);

export const getReferralUrl = createSelector(getLocalStorage, s => s.referralUrl);
