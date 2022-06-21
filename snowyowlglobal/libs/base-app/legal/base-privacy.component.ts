import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { getIsPrivacyLoading, getPrivacyDoc } from '@snowl/app-store/selectors';

@Injectable()
export class BasePrivacyComponent {
  loadingPrivacy$ = this.store.pipe(select(getIsPrivacyLoading));
  privacyDoc$ = this.store.pipe(select(getPrivacyDoc));

  constructor(protected store: Store<any>) {}
}
