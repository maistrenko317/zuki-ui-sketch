import {ChangeDetectionStrategy, Component, OnInit, Renderer2} from '@angular/core';
import { BaseGameDetailsComponent } from '@snowl/base-app/game/base-game-details.component';
import { BaseDialogService } from '@snowl/base-app/shared';
import { GameGuideComponent } from '../game-guide/game-guide.component';
import {PayoutSliderComponent} from "../../shared/payout-slider/payout-slider.component";
import {select, Store} from '@ngrx/store';
import {AppState} from '@snowl/app-store/reducers';
import {getSubscriber} from '@snowl/app-store/selectors';
import {getValue} from '@snowl/base-app/util';
import {InviteFriendsAction} from '@snowl/app-store/actions';

@Component({
  selector: 'sh-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameDetailsComponent extends BaseGameDetailsComponent {
  payoutSliderComponent = PayoutSliderComponent;

  constructor(dialog: BaseDialogService, renderer: Renderer2, store: Store<AppState>) {
    super(dialog, renderer, store);
  }



  viewGameGuide() {
    if (this.game.guideUrl && this.game.guideUrl.length) {
      const win = window.open(this.game.guideUrl, '_blank');
      if (win) win.focus();
    } else {
      this.dialog.openComponent(GameGuideComponent, this.game);
      // this.dialogService.open(GameGuideDialogComponent, null, this.game);
    }
  }
}
