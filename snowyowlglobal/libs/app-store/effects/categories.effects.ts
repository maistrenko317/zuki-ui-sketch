import {Actions, Effect, ofType} from '@ngrx/effects';
import {BaseCategoryService} from '@snowl/base-app/shared/services/base-category.service';
import {LoadCategories, LoadCategoriesFailAction, LoadCategoriesSuccessAction} from '../actions';
import {bufferTime, catchError, filter, map, mergeMap} from 'rxjs/operators';
import {merge, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {
  LoadGamesSuccessAction,
  LoadGameSuccessAction,
  LoadSubscriberGamesSuccessAction
} from '@snowl/app-store/actions';
import {elseMap, resultMap} from 'ts-results/rxjs-operators';

@Injectable()
export class CategoriesEffects {
  /**
   * This watches for when we've loaded games and makes a stream of their categories.
   * After buffering for a bit we see which categories we need and go get them
   */
  @Effect()
  shouldLoadCategories$ = merge(
    this.actions$.pipe(
      ofType<LoadGamesSuccessAction | LoadSubscriberGamesSuccessAction>(LoadGamesSuccessAction.type, LoadSubscriberGamesSuccessAction.type),
      mergeMap(action =>
        action.payload.reduce<string[]>((c, game) => {
          c.push(...game.categoryIds);
          return c;
        }, [])
      )
    ),
    this.actions$.pipe(
      ofType<LoadGameSuccessAction>(LoadGameSuccessAction.type),
      mergeMap(action => action.payload.categoryIds)
    )
  ).pipe(
    bufferTime(300),
    map(categories => {
      return categories.filter(
        (c: string, idx: number) => categories.indexOf(c) === idx && this.handledCategories.indexOf(c) === -1
      ); // Make sure we haven't already handled the categories
    }),
    filter(categories => !!categories.length),
    map((categories) => {
      this.handledCategories.push(...categories);
      return new LoadCategories(categories);
    })
  );

  private handledCategories: string[] = ['*'];

  @Effect()
  loadCategories$ = this.actions$.pipe(
    ofType<LoadCategories>(LoadCategories.type),
    map(action => action.payload),
    mergeMap((categories: string[]) => this.categoryService.loadCategories(categories)),
    resultMap(res => new LoadCategoriesSuccessAction(res)),
    elseMap(err => new LoadCategoriesFailAction(err))
  );

  constructor(private categoryService: BaseCategoryService, private actions$: Actions) {
  }
}
