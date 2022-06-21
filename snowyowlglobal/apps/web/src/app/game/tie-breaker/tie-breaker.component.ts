import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild} from "@angular/core";
import {BaseTieBreakerComponent} from "@snowl/base-app/game";
import {VxDialogRef} from 'vx-components';

@Component({
  templateUrl: './tie-breaker.component.html',
  styleUrls: ['./tie-breaker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TieBreakerComponent extends BaseTieBreakerComponent implements AfterViewInit {

  @ViewChild('number', {static: false}) number: ElementRef<HTMLDivElement>;

  constructor(public dialog: VxDialogRef<TieBreakerComponent>) {
    super();
    this.startCountdown(dialog.data);

    const time = dialog.data.getTime() - Date.now();

    setTimeout(() => {
      dialog.close();
    }, time)
  }

  ngAfterViewInit(): void {
    this.countdown$.subscribe(count => {
      const el = this.number.nativeElement;
      el.innerText = count + '';
      el.className = 'number';
      setTimeout(() => {
        el.className = 'number flash'
      })
    })
  }

}
