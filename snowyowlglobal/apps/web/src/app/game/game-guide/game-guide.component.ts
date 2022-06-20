import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Game } from '@snowl/base-app/model';
import {VxDialogDef, VxDialogRef} from 'vx-components';

@Component({
  selector: 'sh-game-guide',
  templateUrl: './game-guide.component.html',
  styleUrls: ['./game-guide.component.scss']
})
export class GameGuideComponent extends VxDialogDef<Game> implements AfterViewInit {
  @ViewChild('frame', {static: false}) frame: ElementRef;

  constructor(public dialog: VxDialogRef<GameGuideComponent>) {
    super();
    dialog.onCancel.subscribe(() => dialog.close());
  }

  ngAfterViewInit(): void {
    const frame: HTMLIFrameElement = this.frame.nativeElement;
    frame.contentWindow!.document.open();
    const toWrite = this.dialog.data.guideHtmls['en'];
    frame.contentWindow!.document.write(toWrite);
    frame.contentWindow!.document!.head!.innerHTML += '<base target="_parent">';
    frame.contentWindow!.document.close();
    frame.height = frame.contentWindow!.document.body.scrollHeight + 'px';
    frame.width = frame.contentWindow!.document.body.scrollWidth + 'px';
  }
}
