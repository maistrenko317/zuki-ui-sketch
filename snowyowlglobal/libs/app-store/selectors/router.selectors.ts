import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import { RouterState } from '@snowl/app-store/reducers';

export const getRouterState = createFeatureSelector<RouterState>('router');
export const getRouterHistory = createSelector(getRouterState, state => state.history);
export const canNavigateBack = createSelector(getRouterHistory, history => history.length > 1);
