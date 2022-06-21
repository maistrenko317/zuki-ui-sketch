import { Component } from '@angular/core';
import { BackAction } from '@snowl/app-store/actions';
import { getValue } from '@snowl/base-app/util';
import { BaseTournamentComponent } from '@snowl/base-app/game';

@Component({
  selector: 'sh-payouts',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.scss']
})
export class TournamentComponent extends BaseTournamentComponent {

  goBack(): void {
    const game = getValue(this.currentGame$)!;
    this.store.dispatch(new BackAction(`/game/${game.id}`));
  }
}
