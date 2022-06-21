import {ChangeDetectorRef, EventEmitter, Injectable, Input, Output} from "@angular/core";
import {Game, PayoutModel, PayoutModelRound, Round, Subscriber} from "@snowl/base-app/model";
import {animateNumber, keyBy, randomInt} from "@snowl/base-app/util";
import {DecimalPipe} from "@angular/common";
import {Subscription} from 'rxjs';
import {BaseDialogService} from '@snowl/base-app/shared';

const BAR_SIZE = 284;

@Injectable()
export class BaseTournamentDetailComponent {
  @Input() subscriber: Subscriber;
  @Output() viewRound = new EventEmitter<string>();
  barSizes: number[] = [];
  rounds: { [roundSequence: string]: Round } = {};
  currentRound = 0;
  eliminatedRound = 0;
  remainingMatches: number;
  payoutModelRounds: PayoutModelRound[] = [];
  winningsRound = 0;

  private _bracketCountdownSubscription?: Subscription;
  private shownEliminatedDialog = false;
  private shownSavedDialog = false;

  constructor(private cdr: ChangeDetectorRef, private dialog: BaseDialogService) {
  }

  get bracketCountdownText(): string | undefined {
    if (!this.bracketCountdown)
      return;

    const mills = this.bracketCountdown;
    const seconds = (mills / 1000) % 60;
    const minutes = Math.floor(mills / 1000 / 60);
    const numPipe = new DecimalPipe('EN');
    if (minutes) {
      return `${numPipe.transform(minutes)}m ${numPipe.transform(seconds, '1.0-0')}s`
    } else {
      return `${numPipe.transform(seconds, '1.1-1')}`;
    }
  }

  private _bracketCountdown?: number;

  get bracketCountdown(): number | undefined {
    return this._bracketCountdown;
  }

  @Input()
  set bracketCountdown(value: number | undefined) {
    if (value) {
      if (this._bracketCountdownSubscription) {
        this._bracketCountdownSubscription.unsubscribe();
      }
      const ran = randomInt(1, 100);
      this._bracketCountdownSubscription = animateNumber(value, 0, value, 1).subscribe(num => {
        this._bracketCountdown = num;
        this.cdr.markForCheck();
      })
    }
  }

  private _currentPlayerCount: number;

  get currentPlayerCount(): number {
    return this._currentPlayerCount;
  }

  @Input()
  set currentPlayerCount(value: number) {
    this._currentPlayerCount = value;
    this.calcBarSizes();
  }

  private _game: Game;

  get game(): Game {
    return this._game;
  }

  @Input()
  set game(value: Game) {
    if (value) {
      this.rounds = keyBy(value.rounds, "roundSequence");
      if (!this.payoutModelRounds.length && value.actualPayout) {
        this.payoutModelRounds = value.actualPayout.payoutTable.slice().reverse();
        this.calcBarSizes();
      }

      if (!this.currentPlayerCount) {
        this.currentPlayerCount = value.totalPlayers;
      }

      if (value.userEliminated && !this.shownEliminatedDialog) {
        this.shownEliminatedDialog = true;
        // Wait a second and make sure the game is still going before showing the dialog.
        // This keeps the final players from getting the eliminated dialog.
        setTimeout(() => {
          if (this.game.gameStatus !== 'INPLAY')
            return;

          this.dialog.open({
            title: 'Eliminated',
            message: `It looks like you've been eliminated.  Hang around and we'll let you know what you've won at the end of the tournament!`,
            buttons: ['Dismiss']
          });
        }, 2000)
      }

      if (value.wasSaved && !this.shownSavedDialog && value.gameStatus === 'INPLAY') {
        this.shownSavedDialog = true;

        this.dialog.open({
          title: 'Saved!',
          message: `You lost but one of our first round only saves kept you in the game! Keep going!`,
          buttons: ['Dismiss']
        });
      }

      if (value.eliminatedRound) {
        this.eliminatedRound = value.eliminatedRound - value.bracketSequence;
      }
    }

    this._game = value;
  }

  startTournament(): void {
    this.currentPlayerCount = this.game.totalPlayers;

    const decrease = () => {
      const min = this.payoutModelRounds[this.currentRound + 1] ? this.payoutModelRounds[this.currentRound + 1].startingPlayerCount : 0;
      const max = this.payoutModelRounds[this.currentRound].startingPlayerCount;

      let amount = randomInt(0, 3);
      let speed = 300;
      if (max - min < 10) {
        amount = 1;
        speed = randomInt(700, 2000);
      } else if (max - min < 30) {
        speed = 500;
      } else if (max - min < 100) {
        amount = randomInt(0, 5);
      } else if (max - min < 500) {
        amount = randomInt(1, 5);
        speed = 150;
      } else {
        amount = randomInt(1, 10);
        speed = 200;
      }
      this.currentPlayerCount -= amount;

      if (this.currentPlayerCount <= 1) {
        this.currentPlayerCount = 1;
      } else {
        setTimeout(() => decrease(), speed);
      }
      console.log('New Count: ', this.currentPlayerCount)
      this.cdr.detectChanges();
    };

    decrease();
  }

  protected calcBarSizes(): void {
    if (!this.payoutModelRounds || !this.payoutModelRounds.length) return;

    const barSizes: number[] = [];

    let winningsRound = -1;

    for (let i = 0; i < this.payoutModelRounds.length; i++) {
      const count = this.currentPlayerCount;
      const payout = this.payoutModelRounds[i];
      const nextRound = this.payoutModelRounds[i + 1];

      if (payout.eliminatedPayoutAmount && winningsRound === -1) {
        winningsRound = i;
      }

      let size: number;
      if (count > payout.startingPlayerCount) {
        size = 0;
      } else if (nextRound && count <= nextRound.startingPlayerCount) {
        size = BAR_SIZE
      } else if (nextRound) {
        this.currentRound = i;
        this.remainingMatches = count - nextRound.startingPlayerCount;
        size = (payout.startingPlayerCount - count) / (payout.startingPlayerCount - nextRound.startingPlayerCount) * BAR_SIZE;
      } else { // Last round
        this.currentRound = i;
        this.remainingMatches = count - 1;
        size = count <= 1 ? BAR_SIZE : 0;
      }

      barSizes.push(size);
    }

    this.winningsRound = winningsRound;
    this.barSizes = barSizes;
  }
}
