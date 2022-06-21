import { Localized } from '../../model/index';
import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Category } from '../../model/index';
import { filter, map, take } from 'rxjs/operators';
import { AppState } from '@snowl/app-store/reducers/index';
import { getCategories } from '@snowl/app-store/selectors/index';

@Pipe({
  name: 'categoryName'
})
export class BaseCategoryNamePipe implements PipeTransform {
  categories$: Observable<Dict<Category>>;
  constructor(private store: Store<AppState>) {
    this.categories$ = store.pipe(select(getCategories));
  }

  transform(value: string, ...args: any[]): Observable<Localized> {
    return this.categories$.pipe(
      map(categories => categories[value]),
      filter(category => !!category),
      take(1),
      map(category => category.categoryName)
    );
  }
}
