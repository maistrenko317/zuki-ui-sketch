import {EventEmitter, Injectable, Input, Output, Type} from '@angular/core';
import { Game, Subscriber } from '@snowl/base-app/model';
import {BaseDialogService} from '@snowl/base-app/shared';
import {AppState} from '@snowl/app-store/reducers';
import {Store} from '@ngrx/store';
import {InviteFriendsAction} from '@snowl/app-store/actions';

@Injectable()
export abstract class BaseMeComponent {
  @Input() subscriber: Subscriber;
  @Input() isLoggedIn = false;
  @Input() isLoadingGames = false;
  @Input() games: Game[] = [];

  constructor(private dialogService: BaseDialogService, private store: Store<AppState>) {

  }

  inviteFriends(): void {
    this.store.dispatch(new InviteFriendsAction(this.subscriber));
  }

  get numWins(): number {
    if (!this.isLoggedIn) {
      return 0;
    }
    let count = 0;
    this.subscriber.gamePlayers.forEach(player => {
      if (player.payoutAwardedAmount && player.payoutAwardedAmount > 0) count++;
    });
    return count;
  }

  get wallet(): number {
    if (!this.isLoggedIn) {
      return 0;
    }
    return this.subscriber.wallet;
  }

  get numGames(): number {
    if (!this.isLoggedIn || !this.subscriber.gamePlayers) {
      return 0;
    }
    return this.subscriber.gamePlayers.length;
  }

  trackGame(game: Game): string {
    return game.id;
  }
}
