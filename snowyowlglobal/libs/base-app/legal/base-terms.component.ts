import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { getIsTermsLoading, getTermsDoc } from '@snowl/app-store/selectors';

@Injectable()
export class BaseTermsComponent {
  isLoadingTerms$ = this.store.pipe(select(getIsTermsLoading));
  termsDoc$ = this.store.pipe(select(getTermsDoc));

  constructor(protected store: Store<any>) {}
}
