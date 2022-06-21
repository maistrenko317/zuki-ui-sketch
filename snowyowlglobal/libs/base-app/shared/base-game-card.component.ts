import {Injectable, Input, Type} from '@angular/core';
import { Game } from '../model';
import {BaseDialogService, DialogContent} from "@snowl/base-app/shared/services";
import {formatRelative} from 'date-fns';
import {Constructor} from '@snowl/base-app/util';
import {BasePayoutSliderComponent} from '@snowl/base-app/shared/base-payout-slider.component';

@Injectable()
export abstract class BaseGameCardComponent {
  @Input() game: Game;
  @Input() hasContent = false;

  abstract payoutSliderComponent: Constructor<BasePayoutSliderComponent>;

  constructor(private dialog: BaseDialogService) {

  }

  get gameStatus(): string {
    switch (this.game.playStatus) {
      case 'UPCOMING':
        return 'Upcoming';
      case 'POOL':
        return 'Pool Play';
      case 'BRACKET':
        return 'Bracket Play';
      case 'FINISHED':
      default:
        return 'Over';
    }
  }

  ticketPriceInfo(): boolean {
    this.dialog.open({
      title: 'Ticket Price',
      message: `A game's ticket price is the price to join and play a game.  It costs $${this.game.costToJoin} to join this game.`,
      buttons: ['Close']
    });
    return false;
  }

  startTimeInfo(): boolean {
    this.dialog.open({
      title: 'Game Start Time',
      content: [
        new DialogContent('text', {
          spans: [
            new DialogContent('text', {text: 'The tournament for this game starts '}),
            new DialogContent('text', {text: formatRelative(this.game.expectedStartDateForBracketPlay, new Date()), bolded: true}),
          ]
        }),
        new DialogContent('text', {
          mTop: 10,
          spans: [
            new DialogContent('text', {text: 'Make sure you are here '}),
            new DialogContent('text', {text: 'ready to play', underline: true}),
            new DialogContent('text', {text: ' at this time!'}),
          ]
        })
      ],
      buttons: ['Dismiss']
    });

    return false;
  }

  showPayoutSlider(): boolean {
    this.dialog.openComponent(this.payoutSliderComponent, this.game);

    return false;
  }
}
