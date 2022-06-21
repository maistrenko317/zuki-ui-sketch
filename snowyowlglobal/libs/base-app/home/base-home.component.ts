import { Store, select } from '@ngrx/store';
import { HomeState, HomeTab } from '@snowl/home-store/reducers';
import { Injectable, OnInit } from '@angular/core';
import { Game } from '../model';
import {
  getAllSelectedGames,
  getCurrentHomeTab, getLoadingReferralInfo, getReferralTransactions,
  getReferredSubscribers,
  getSelectedGamesView
} from '@snowl/home-store/selectors';
import {JoinPrivateGameAction, LoadGamesAction, LoadSubscriberAction, LogoutAction} from '@snowl/app-store/actions';
import { SelectGameViewAction } from '@snowl/home-store/actions';
import {
  getGamesLoading,
  getIsLoadingSubscriber,
  getIsLoadingSubscriberGames,
  getIsLoggedIn, getReferralUrl,
  getSubscriber,
  getSubscriberGames
} from '@snowl/app-store/selectors';
import { Subscriber } from '@snowl/base-app/model';
import { Observable ,  of,  Subject ,  timer ,  zip } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { getValue } from '@snowl/base-app/util';
import {LoadReferralInfoAction} from '@snowl/home-store/actions/affiliate.actions';

@Injectable()
export abstract class BaseHomeComponent {
  $selectedGamesView = this.store.pipe(select(getSelectedGamesView));
  $currentTab = this.store.pipe(select(getCurrentHomeTab));
  games$ = this.store.pipe(select(getAllSelectedGames));
  subscriber$ = this.store.pipe(select(getSubscriber));
  isLoggedIn$ = this.store.pipe(select(getIsLoggedIn));
  subscriberGames$ = this.store.pipe(select(getSubscriberGames));
  loadingSubscriberGames$ = this.store.pipe(select(getIsLoadingSubscriberGames));
  gamesLoading$ = this.store.pipe(select(getGamesLoading));
  loadingSubscriber$ = this.store.pipe(select(getIsLoadingSubscriber));

  //---- Referral Tab
  referredSubscribers$ = this.store.pipe(select(getReferredSubscribers));
  referralTransactions$ = this.store.pipe(select(getReferralTransactions));
  loadingReferralInfo$ = this.store.pipe(select(getLoadingReferralInfo));
  referralUrl$ = this.store.pipe(select(getReferralUrl));


  constructor(protected store: Store<HomeState>) {}

  selectGamesView(view: HomeGameView): void {
    this.store.dispatch(new SelectGameViewAction(view));
  }

  refreshGames(callback: () => void): void {
    this.store.dispatch(new LoadGamesAction());
    const refreshed$ = this.gamesLoading$.pipe(filter(bool => !bool), take(1));
    zip(refreshed$, timer(1000)).subscribe(() => callback());
  }

  refreshMe(callback: () => void): void {
    const subscriber = getValue(this.subscriber$);
    if (subscriber && subscriber.subscriberId) {
      this.store.dispatch(new LoadSubscriberAction());
      const refreshed$ = this.loadingSubscriber$.pipe(filter(bool => !bool), take(1));

      zip(refreshed$, timer(1000)).subscribe(() => callback());
    } else {
      setTimeout(() => callback(), 1000);
    }
  }

  refreshReferrals(callback: () => void): void {
    // this.store.dispatch(new LoadReferralInfoAction());
    // const refreshed$ = this.loadingReferralInfo$.pipe(filter(bool => !bool), take(1));
    const refereshed$ = of(true);
    zip(refereshed$, timer(1000)).subscribe(() => callback());
  }

  joinPrivateGame(code: string): void {
    this.store.dispatch(new JoinPrivateGameAction(code));
  }
}

export type HomeGameView = 'my' | 'all';
