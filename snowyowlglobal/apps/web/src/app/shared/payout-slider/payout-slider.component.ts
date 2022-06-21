import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Type, ViewChild} from '@angular/core';
import {Game} from "@snowl/base-app/model";
import {BaseGameService, BasePayoutSliderComponent} from '@snowl/base-app/shared';
import {AppState} from '@snowl/app-store/reducers';
import {Store} from '@ngrx/store';
import {VxDialogDef, VxDialogRef} from 'vx-components';

@Component({
  selector: 'sh-payout-slider',
  templateUrl: './payout-slider.component.html',
  styleUrls: ['./payout-slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayoutSliderComponent extends BasePayoutSliderComponent {

  game: Game;

  constructor(cdr: ChangeDetectorRef, gameService: BaseGameService,
              store: Store<AppState>, dialog: VxDialogRef<PayoutSliderComponent>) {
    super(store, gameService, cdr);

    dialog.onCancel.subscribe(() => dialog.close());
    this.game = dialog.data;
    this.init();
  }
}
