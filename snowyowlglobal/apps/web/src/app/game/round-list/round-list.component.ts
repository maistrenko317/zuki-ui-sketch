import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  NgZone,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import { BaseRoundListComponent } from '@snowl/base-app/game';
import { Round } from '@snowl/base-app/model';
import { AppState } from '@snowl/app-store/reducers';
import { Store, select } from '@ngrx/store';
import { animateNumber } from '@snowl/base-app/util';

@Component({
  selector: 'sh-round-list',
  templateUrl: `./round-list.component.html`,
  styleUrls: ['./round-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoundListComponent extends BaseRoundListComponent {
  constructor(protected store: Store<AppState>) {
    super(store);
  }
}
