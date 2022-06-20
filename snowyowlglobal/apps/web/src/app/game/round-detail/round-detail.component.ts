import {AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {BaseRoundDetailComponent} from '@snowl/base-app/game';
import {TieBreakerComponent} from "../tie-breaker/tie-breaker.component";
import {VxDialogComponent, VxDialogRef} from 'vx-components';

@Component({
  selector: 'sh-round-detail',
  templateUrl: './round-detail.component.html',
  styleUrls: ['./round-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoundDetailComponent extends BaseRoundDetailComponent implements AfterViewInit {
  tieBreakerComponent = TieBreakerComponent;

  @Input('dialog')
  vxDialog: VxDialogRef;

  private _paired = false;

  get paired(): boolean {
    return this._paired;
  }

  set paired(value: boolean) {
    this._paired = value;
    setTimeout(() => {
      this.updateDialogDimensions();
    }, 50);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateDialogDimensions();
    }, 50);
  }

  private updateDialogDimensions(): void {
    if (!this.vxDialog)
      return;

    // TODO: FIGURE OUT HOW TO DO THIS!
    //   const dialog: HTMLElement = (this.vxDialog as any).dialog;
    //   dialog.
    //   if (!this.paired) {
    //     const dialogEl = this.vxDialog.dialog.nativeElement as HTMLElement;
    //     this.vxDialog.dialogOptions.width = dialogEl.offsetWidth + 'px';
    //     this.vxDialog.dialogOptions.height = dialogEl.offsetHeight + 'px';
    //   } else if (this.vxDialog) {
    //     this.vxDialog.dialogOptions.width = '380px';
    //     this.vxDialog.dialogOptions.height = '650px';
    //   }
    // }
  }
}
