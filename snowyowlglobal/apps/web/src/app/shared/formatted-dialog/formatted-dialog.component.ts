import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {FormattedDialogOptions, DialogContent} from '@snowl/base-app/shared';
import {Observable, Subscription} from 'rxjs';
import {VxDialogDef, VxDialogRef} from 'vx-components';

@Component({
  templateUrl: './formatted-dialog.component.html',
  styleUrls: ['./formatted-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormattedDialogComponent extends VxDialogDef<FormattedDialogOptions, string | null> implements OnDestroy  {

  content: DialogContent[] = [];
  buttons: string[] = [];
  title?: string;

  private subscription?: Subscription;
  constructor(private cdr: ChangeDetectorRef, public dialog: VxDialogRef<FormattedDialogComponent>) {
    super();

    dialog.onCancel.subscribe(() => dialog.close(null));

    const {content, buttons, title} = dialog.data;
    if (content instanceof Observable) {
      this.subscription = content.subscribe(c => {
        this.content = c;
        this.cdr.markForCheck();
      })
    } else {
      this.content = content;
    }

    this.dialog = dialog;
    this.buttons = buttons;
    this.title = title;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  handleClick(c: DialogContent, e: Event) {
    if (c.clickResponse) {
      this.dialog.close(c.clickResponse);
      e.preventDefault();
      e.stopPropagation();
    }
  }
}
