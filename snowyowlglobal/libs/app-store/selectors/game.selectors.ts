import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GamesState } from '../reducers';
import { getRouterState } from '@snowl/app-store/selectors/router.selectors';
import { getRoundEntities } from '@snowl/app-store/selectors/round.selectors';
import { denormalizeGame } from '@snowl/app-store/normalizer';

export const getGamesState = createFeatureSelector<GamesState>('games');

export const getGameEntities = createSelector(getGamesState, state => state.gameEntities);
export const getGameIds = createSelector(getGamesState, state => state.gameIds);
export const getAllGames = createSelector(getGameEntities, getGameIds, (entities, ids) => ids.map(key => entities[key]));
export const getGamesLoading = createSelector(getGamesState, state => state.loading);

export const getCurrentGameId = createSelector(getRouterState, state => (state.state ? state.state.params.gameId : ''));

export const getCurrentGame = createSelector(
  getGameEntities,
  getCurrentGameId,
  getRoundEntities,
  (entities, id, rounds) => {
    return rounds && entities[id] ? denormalizeGame(entities[id], rounds) : undefined;
  }
);

export const getCurrentGameClientState = createSelector(getCurrentGame, game => (game ? game.clientStatus : 'DEFAULT'));

export const getGameLoading = createSelector(getGamesState, state => state.loading);
