import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BaseGameComponent } from '@snowl/base-app/game';
import { Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { getIsDeviceMobile } from '../shared/store/selectors/device.selectors';
import {BaseDialogService} from '@snowl/base-app/shared';

@Component({
  selector: 'sh-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent extends BaseGameComponent {
  isMobile$ = this.store.pipe(select(getIsDeviceMobile));

  refreshGame(done: Subject<void>): void {
    this.refresh(() => done.next());
  }
}
