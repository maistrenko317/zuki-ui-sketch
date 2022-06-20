import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BaseGameCardComponent } from '@snowl/base-app/shared';
import {PayoutSliderComponent} from "../payout-slider/payout-slider.component";

@Component({
  selector: 'sh-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.card]': 'true'
  }
})
export class GameCardComponent extends BaseGameCardComponent {
  payoutSliderComponent = PayoutSliderComponent;
}
