import { Pipe, PipeTransform } from '@angular/core';
import { Localized } from '../../model/index';
import { PublicProfile } from '@snowl/base-app/model/public-profile';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@snowl/app-store/reducers/index';
import { getPublicProfiles } from '@snowl/app-store/selectors/index';
import { filter, map, take } from 'rxjs/operators';
import { LoadPublicProfilesAction } from '@snowl/app-store/actions/index';

@Pipe({
  name: 'publicProfile'
})
export class BasePublicProfilePipe implements PipeTransform {
  private profiles$ = this.store.pipe(select(getPublicProfiles));
  constructor(private store: Store<AppState>) {}
  transform(id: number, ...args: any[]): Observable<PublicProfile> | null {
    if (!id) return null;
    return this.profiles$.pipe(map(profiles => profiles[id]), filter(profile => !!profile), take(1));
  }
}
