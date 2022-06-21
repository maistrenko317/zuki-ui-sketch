import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GameplayState } from '@snowl/app-store/reducers';

export const getGameplayState = createFeatureSelector<GameplayState>('gameplay');

export const getIsJoiningGame = createSelector(getGameplayState, state => state.joiningGame);

export const getCurrentPlayerCount = createSelector(getGameplayState, state => state.currentPlayerCount);

export const getBracketCountdown = createSelector(getGameplayState, state => state.bracketCountdownTime);
export const getClientTimeDrift = createSelector(getGameplayState, state => state.clientTimeDrift);
