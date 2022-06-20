import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PublicProfileState } from '@snowl/app-store/reducers';

export const getPublicProfileState = createFeatureSelector<PublicProfileState>('publicProfile');
export const getPublicProfiles = createSelector(getPublicProfileState, state => state.entities);
