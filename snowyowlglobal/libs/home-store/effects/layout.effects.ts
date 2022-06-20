import {Injectable} from '@angular/core';
import {SerializedRoute} from '@snowl/app-store/reducers';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {BaseHomeComponent} from '@snowl/base-app/home';
import {ROUTER_NAVIGATION, RouterNavigationAction} from '@ngrx/router-store';
import {filter, map, startWith, throttleTime} from 'rxjs/operators';
import {SelectHomeTabAction} from '@snowl/home-store/actions';
import {HomeTab} from '@snowl/home-store/reducers';
import {LoadGamesAction, LogoutAction, UserAuthenticatedAction} from '@snowl/app-store/actions';
import {merge, of} from 'rxjs';

@Injectable()
export class LayoutEffects {
  @Effect()
  tabSelect$ = this.actions$.pipe(
    ofType<RouterNavigationAction<SerializedRoute>>(ROUTER_NAVIGATION),
    map(e => e.payload.routerState),
    filter(state => !!state.component && BaseHomeComponent.isPrototypeOf(state.component)),
    map(state => {
      const tab = state.url.replace('/home/', '');
      return new SelectHomeTabAction(tab as HomeTab);
    })
  );

  @Effect()
  loadGames$ = merge(
    this.actions$.pipe(ofType<SelectHomeTabAction>(SelectHomeTabAction.type),
      filter(action => action.payload === 'games')), // when we go to the games tab
    this.actions$.pipe(ofType(UserAuthenticatedAction.type)), // or when the user is authenticated
    this.actions$.pipe(ofType(LogoutAction.type)),// or when the user logs out
  ).pipe(
    startWith(true), // load games on initialization
    throttleTime(10000), // don't load more than once per every 10 seconds
    map(() => new LoadGamesAction()) // load the games
  );

  constructor(private actions$: Actions) {
  }
}
