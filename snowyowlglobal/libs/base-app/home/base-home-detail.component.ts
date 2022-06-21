import {Input, Output, EventEmitter} from '@angular/core';
import {HomeTab} from '@snowl/home-store/reducers';
import {HomeGameView} from './base-home.component';
import {Game, NormalizedGame, Subscriber} from '@snowl/base-app/model';
import {ReferralTransaction} from '@snowl/base-app/model/referral-transaction';
import {ReferredSubscriber} from '@snowl/base-app/model/referred-subscriber';

export class BaseHomeDetailComponent {
  @Input() currentTab: HomeTab;
  @Input() selectedGamesView: HomeGameView;
  @Input() gamesLoading: boolean;
  @Input() isLoggedIn: boolean;
  @Input() games: NormalizedGame[];

  @Input() subscriber?: Subscriber;
  @Input() subscriberGames: NormalizedGame[];
  @Input() loadingSubscriberGames: boolean;

  //----- Referral
  @Input() loadingReferralInfo: boolean;
  @Input() referralTransactions: ReferralTransaction[];
  @Input() referredSubscribers: ReferredSubscriber[];
  @Input() referralUrl?: string;
  //----- End Referral

  @Output() joinPrivateGame = new EventEmitter<string>();
  @Output() selectGamesView = new EventEmitter<string>();
  @Output() refresh = new EventEmitter<any>();

  privateEventCode = '';
}
