import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BaseGameListComponent } from '@snowl/base-app/home';

@Component({
  selector: 'sh-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameListComponent extends BaseGameListComponent {}
