import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CategoriesState } from '../reducers';

export const getCategoriesState = createFeatureSelector<CategoriesState>('categories');
export const getCategories = createSelector(getCategoriesState, s => s.entities);
