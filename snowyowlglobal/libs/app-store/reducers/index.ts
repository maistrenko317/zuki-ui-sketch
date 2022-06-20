import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { routerReducer, RouterState } from './router.reducers';
import { categoriesReducer, CategoriesState } from './categories.reducer';
import { httpReducer, HttpState } from './http.reducers';
import { gamesReducer, GamesState } from './games.reducer';
import { localStorageReducer, LocalStorageState } from '../reducers/local-storage.reducer';
import { authReducer, AuthState, logoutMetaReducer } from './auth.reducer';
import { publicProfileReducer, PublicProfileState } from '@snowl/app-store/reducers/public-profile.reducer';
import { roundsReducer, RoundsState } from '@snowl/app-store/reducers/round.reducer';
import { syncMessagesMetaReducer } from '@snowl/app-store/reducers/sync-message.reducer';
import { gameplayReducer, GameplayState } from '@snowl/app-store/reducers/gameplay.reducer';
import { legalReducer, LegalState } from '@snowl/app-store/reducers/legal.reducer';

export * from './router.reducers';
export * from './games.reducer';
export * from './http.reducers';
export * from './categories.reducer';
export * from './local-storage.reducer';
export * from './auth.reducer';
export * from './public-profile.reducer';
export * from './round.reducer';
export * from './sync-message.reducer';
export * from './gameplay.reducer';
export * from './legal.reducer';

export interface AppState {
  router: RouterState;
  http: HttpState;
  games: GamesState;
  rounds: RoundsState;
  categories: CategoriesState;
  localStorage: LocalStorageState;
  auth: AuthState;
  publicProfile: PublicProfileState;
  gameplay: GameplayState;
  legal: LegalState;
}

export const appReducers: ActionReducerMap<AppState, any> = {
  router: routerReducer,
  http: httpReducer,
  games: gamesReducer,
  rounds: roundsReducer,
  categories: categoriesReducer,
  localStorage: localStorageReducer,
  auth: authReducer,
  publicProfile: publicProfileReducer,
  gameplay: gameplayReducer,
  legal: legalReducer
};

export const appMetaReducers: MetaReducer<AppState, any>[] = [logoutMetaReducer, syncMessagesMetaReducer];
