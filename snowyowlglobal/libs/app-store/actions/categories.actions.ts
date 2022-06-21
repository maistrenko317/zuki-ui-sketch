import { Action } from '@ngrx/store';
import { Category } from '@snowl/base-app/model';

const LOAD_CATEGORIES = '[Categories] Load Categories';
const LOAD_CATEGORIES_FAIL = '[Categories] Load Categories Fail';
const LOAD_CATEGORIES_SUCCESS = '[Categories] Load Categories Success';

export class LoadCategories implements Action {
  static readonly type = LOAD_CATEGORIES;
  readonly type = LOAD_CATEGORIES;

  constructor(public payload: string[]) {}
}

export class LoadCategoriesFailAction implements Action {
  static readonly type = LOAD_CATEGORIES_FAIL;
  readonly type = LOAD_CATEGORIES_FAIL;

  constructor(public payload: any) {}
}

export class LoadCategoriesSuccessAction implements Action {
  static readonly type = LOAD_CATEGORIES_SUCCESS;
  readonly type = LOAD_CATEGORIES_SUCCESS;

  constructor(public payload: Category[]) {}
}

export type CategoriesActions = LoadCategories | LoadCategoriesFailAction | LoadCategoriesSuccessAction;
