import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@snowl/app-store/reducers';
import { getIsLoggedIn } from '@snowl/app-store/selectors';
import { map } from 'rxjs/operators';
import { BackAction, GoAction } from '@snowl/app-store/actions';

@Injectable()
export class LoggedOutGuard implements CanActivate {
  constructor(private store: Store<AppState>) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store.pipe(select(getIsLoggedIn)).pipe(
      map(loggedIn => {
        if (loggedIn) this.store.dispatch(new BackAction('/home/me'));
        return !loggedIn;
      })
    );
  }
}
