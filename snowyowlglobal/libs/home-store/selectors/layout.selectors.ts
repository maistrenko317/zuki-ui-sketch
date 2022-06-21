import { createSelector } from '@ngrx/store';
import { getHomeState } from '../reducers';
import { getAllGames } from '@snowl/app-store/selectors';
import { shouldShowGame } from '@snowl/base-app/util';

export const getHomeLayout = createSelector(getHomeState, s => s.layout);
export const getCurrentHomeTab = createSelector(getHomeLayout, l => l.selectedTab);

export const getSelectedGamesView = createSelector(getHomeLayout, state => state.selectedGameView);
export const getAllSelectedGames = createSelector(getAllGames, getSelectedGamesView, (games, view) => {
  return games.filter(game => {
    return shouldShowGame(game) && (view === 'all' ? true : game.userJoinedGame);
  });
});
