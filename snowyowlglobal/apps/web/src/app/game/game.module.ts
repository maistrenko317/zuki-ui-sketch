import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { GameComponent } from './game.component';
import { Route, RouterModule, Routes } from '@angular/router';
import { GameDetailsComponent } from './game-details/game-details.component';
import { RoundListComponent } from './round-list/round-list.component';
import { RoundComponent } from './round/round.component';
import { RoundDetailComponent } from './round-detail/round-detail.component';
import { TournamentComponent } from './tournament/tournament.component';
import { GameGuideComponent } from './game-guide/game-guide.component';
import { GameResultsComponent } from './game-results/game-results.component';
import { TournamentDetailComponent } from './tournament-detail/tournament-detail.component';
import {GAME_MODULE_EFFECTS, GAME_RESULTS_DIALOG, ROUND_DIALOG} from "@snowl/app-store/effects";
import {BaseGameplayService} from "@snowl/base-app/shared/services";
import {EffectsModule, ofType} from '@ngrx/effects';
import {TieBreakerComponent} from "./tie-breaker/tie-breaker.component";
import {GameCalendarComponent} from './game-calendar/game-calendar.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home/games' },
  {
    path: ':gameId',
    component: GameComponent
  },
  {
    path: ':gameId/tournament',
    component: TournamentComponent
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    EffectsModule.forFeature(GAME_MODULE_EFFECTS)
  ],
  declarations: [
    GameComponent,
    GameDetailsComponent,
    RoundListComponent,
    RoundComponent,
    RoundDetailComponent,
    TournamentComponent,
    GameGuideComponent,
    GameResultsComponent,
    TournamentDetailComponent,
    TieBreakerComponent,
    GameCalendarComponent
  ],
  entryComponents: [RoundComponent, GameGuideComponent, GameResultsComponent, TieBreakerComponent],
  exports: [RoundComponent],
  providers: [
    BaseGameplayService,
    { provide: GAME_RESULTS_DIALOG, useValue: GameResultsComponent },
    {provide: ROUND_DIALOG, useValue: RoundComponent},
  ]
})
export class GameModule {}
