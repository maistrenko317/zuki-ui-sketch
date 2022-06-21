import * as fromDevice from './device.reducer';
import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { DeviceState } from './device.reducer';

export interface SharedState {
  device: fromDevice.DeviceState;
}

export const sharedFeatureReducers: any = {
  device: fromDevice.reducer
};

export const getSharedState = createFeatureSelector<SharedState>('shared');
