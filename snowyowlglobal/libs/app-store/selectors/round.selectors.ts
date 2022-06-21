import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RoundsState } from '@snowl/app-store/reducers/round.reducer';

export const getRoundsState = createFeatureSelector<RoundsState>('rounds');
export const getRoundEntities = createSelector(getRoundsState, state => state.entities);

export const getCurrentRoundId = createSelector(getRoundsState, state => state.currentRound);

export const getCurrentRound = createSelector(getCurrentRoundId, getRoundEntities, (id, entities) => {
  return entities[id || ''];
});
