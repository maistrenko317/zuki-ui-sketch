import { Category } from '@snowl/base-app/model';
import {CategoriesActions, LoadCategoriesSuccessAction} from '../actions';

export interface CategoriesState {
  entities: Dict<Category>;
}

let initialState: CategoriesState = {
  entities: {
    '*': {
      id: '*',
      categoryKey: '*',
      categoryName: {
        en: 'All Categories'
      }
    }
  }
};

export function categoriesReducer(state = initialState, action: CategoriesActions): CategoriesState {
  switch (action.type) {
    case LoadCategoriesSuccessAction.type:
      const result = {
        entities: {
          ...state.entities,
          ...action.payload.reduce<Dict<Category>>((all, category) => {
            all[category.id] = category;
            return all;
          }, {})
        }
      };
      initialState = result; // Categories should be preserved when logging out
      return result;

    default:
      return state;
  }
}
