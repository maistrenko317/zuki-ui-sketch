import {
  ChangeDetectionStrategy,
  ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, QueryList, ViewChild,
  ViewChildren
} from '@angular/core';
import {BaseTournamentDetailComponent} from "@snowl/base-app/game";
import {animateNumber} from "@snowl/base-app/util";
import {EasingFunctions} from "@snowl/base-app/animations";
import {BaseDialogService} from '@snowl/base-app/shared';

const headerHeight = 47;

@Component({
  selector: 'sh-tournament-detail',
  templateUrl: './tournament-detail.component.html',
  styleUrls: ['./tournament-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TournamentDetailComponent extends BaseTournamentDetailComponent {
  @ViewChildren('roundPayout') roundPayoutEls: QueryList<ElementRef>;
  @ViewChild('sticky', {static: false}) stickyEl: ElementRef<HTMLDivElement>;

  constructor(private zone: NgZone, cdr: ChangeDetectorRef, dialog: BaseDialogService) {
    super(cdr, dialog);
    // (window as any).startTournament = this.startTournament.bind(this);
  }

  get currentRound(): number {
    return this._currentRound;
  }

  set currentRound(value: number) {
    if (value !== this.currentRound) {
      this._currentRound = value;
      setTimeout(() => {
        this.scrollToCurrentRound();
      }, 500);
    }
  }

  private _currentRound: number;

  private scrollToCurrentRound(): void {
    if (!this.roundPayoutEls)
      return;

    const elRef = this.roundPayoutEls.toArray()[this.currentRound];
    if (!elRef)
      return;

    let stickyHeight = 0;
    if (this.stickyEl) {
      stickyHeight = this.stickyEl.nativeElement.offsetHeight;
    }

    const element = elRef.nativeElement as HTMLDivElement;
    const scroller = document.scrollingElement as HTMLElement;
    const from = scroller.scrollTop;
    const margin = 15;
    let to = element.offsetTop - headerHeight - stickyHeight - margin;

    if (to > scroller.scrollHeight) {
      to = scroller.scrollHeight;
    }


    this.zone.runOutsideAngular(() => {
      animateNumber(from, to, 800, -1, EasingFunctions.easeInOutQuad).subscribe(number => {
        scroller.scrollTop = number;
      });
    })
  }
}
