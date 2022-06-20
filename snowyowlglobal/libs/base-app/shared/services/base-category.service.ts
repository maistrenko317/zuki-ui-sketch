import { BaseHttpService } from './base-http.service';
import { Injectable } from '@angular/core';
import {Category, ShoutResponse} from '../../model';
import { Observable ,  of } from 'rxjs';
import {Ok, Result} from 'ts-results';
import {ShoutErrorResponse} from '@snowl/base-app/error';
import {resultMap} from 'ts-results/rxjs-operators';

@Injectable()
export class BaseCategoryService {
  constructor(private http: BaseHttpService) {}

  loadCategories(ids: string[]): Observable<Result<Category[], ShoutErrorResponse<CategoryResponse>>> {
    if (!ids.length) return of(Ok([]));

    return this.http
      .sendCollectorRequest<CategoryResponse>('/snowl/getQuestionCategoriesFromCategoryIds', { categories: ids.join() })
      .pipe(
        resultMap(resp => resp.questionCategories)
      );
  }
}

interface CategoryResponse extends ShoutResponse {
  questionCategories: Category[];
}
