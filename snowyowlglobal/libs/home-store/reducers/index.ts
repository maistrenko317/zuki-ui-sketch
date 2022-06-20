import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { HomeLayout, homeLayoutReducer } from '@snowl/home-store/reducers/layout.reducer';
import {affiliateReducer, AffiliateState} from '@snowl/home-store/reducers/affiliate.reducer';
export * from './layout.reducer';
export * from './affiliate.reducer';

export interface HomeState {
  layout: HomeLayout;
  affiliate: AffiliateState;
}

export const homeFeatureReducers: ActionReducerMap<HomeState, any> = {
  layout: homeLayoutReducer,
  affiliate: affiliateReducer
};

export const getHomeState = createFeatureSelector<HomeState>('home');
