import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HttpState } from '../reducers/http.reducers';

export const getHttpState = createFeatureSelector<HttpState>('http');
export const getSrd = createSelector(getHttpState, s => s.srd);
export const getCanSeeContentWithoutLogin = createSelector(getHttpState, s => s.canSeeContentWithoutLogin);
