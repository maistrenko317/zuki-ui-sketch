import { Input } from '@angular/core';
import { Game } from '../model';

export class BaseGameListComponent {
  @Input() games: Game[];
  @Input() loading: boolean;

  trackGame(game: Game): string {
    return game.id;
  }
}
