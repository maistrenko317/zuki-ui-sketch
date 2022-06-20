import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {VxDialogDef, VxDialogRef} from 'vx-components';

@Component({
  selector: 'sh-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingComponent extends VxDialogDef<string> {
  message: string;

  constructor(private dialog: VxDialogRef<LoadingComponent>) {
    super();

    this.message = dialog.data;
  }
}
