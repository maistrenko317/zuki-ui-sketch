import { createSelector } from '@ngrx/store';
import { getSharedState } from '../reducers';

export const getDeviceState = createSelector(getSharedState, s => s.device);
export const getIsDeviceMobile = createSelector(getDeviceState, s => s.isMobile);
