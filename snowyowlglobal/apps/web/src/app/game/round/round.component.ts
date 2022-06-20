import { Component, OnInit } from '@angular/core';
import { BaseRoundComponent } from '@snowl/base-app/game';
import {VxDialogRef} from 'vx-components';
import {Store} from '@ngrx/store';
import {AppState} from '@snowl/app-store/reducers';

@Component({
  selector: 'sh-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.scss']
})
export class RoundComponent extends BaseRoundComponent {
  constructor(public dialog: VxDialogRef, store: Store<AppState>) {
    super(store);
    this.dialog = dialog;
  }
}
