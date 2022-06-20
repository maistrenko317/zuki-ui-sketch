import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@snowl/app-store/reducers';
import {getCanSeeContentWithoutLogin, getIsLoggedIn} from '@snowl/app-store/selectors';
import {filter, map, take} from 'rxjs/operators';
import { BackAction, GoAction } from '@snowl/app-store/actions';
import {getValue} from "@snowl/base-app/util";

@Injectable()
export class LoggedInIfNecessaryGuard implements CanActivate {
  constructor(private store: Store<AppState>) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.store.pipe(select(getCanSeeContentWithoutLogin)).pipe(
      filter(resp => resp !== undefined),
      map(canSeeContent => {
        const loggedIn = getValue(this.store.pipe(select(getIsLoggedIn)));

        if (loggedIn || canSeeContent) {
          return false;
        } else {
          return true;
        }
      }),
      take(1)
    ).subscribe((shouldNavigate) => {
      if (shouldNavigate)
        this.store.dispatch(new GoAction(['/auth/login'], {clearHistory: true, animated: false}));
    });

    return true;
  }
}
