import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import {StoreModule} from '@ngrx/store';
import {homeFeatureReducers} from '@snowl/home-store/reducers';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {EffectsModule, ofType} from '@ngrx/effects';
import {HOME_EFFECTS} from '@snowl/home-store/effects';
import {GameListComponent} from './game-list/game-list.component';
import {MeComponent} from './me/me.component';
import {EditMeComponent} from './edit-me/edit-me.component';
import {VxButtonGroupModule} from 'vx-components';
import {HomeDetailComponent} from './home-detail/home-detail.component';
import {BaseAffiliateService} from '@snowl/base-app/home';
import {ReferralComponent} from './referral/referral.component';
import {ReferralEventListComponent} from './referral-list/referral-event-list.component';
import {ReferralTableComponent} from './referral-list/referral-table/referral-table.component';
import {ReferrerProfileComponent} from './referral-list/referrer-profile/referrer-profile.component';
import { GameCalendarComponent } from '../game/game-calendar/game-calendar.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [{path: '', redirectTo: 'games'}, {path: 'games'}, {path: 'referrals'}, {path: 'me'}, {path: 'game-calendar'}]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    StoreModule.forFeature('home', homeFeatureReducers),
    EffectsModule.forFeature(HOME_EFFECTS),
    SharedModule,
    VxButtonGroupModule
  ],
  declarations: [
    HomeComponent,
    HomeDetailComponent,
    GameListComponent,
    GameCalendarComponent,
    MeComponent,
    EditMeComponent,
    ReferralComponent,
    ReferralEventListComponent,
    ReferralTableComponent,
    ReferrerProfileComponent
  ],
  providers: [BaseAffiliateService],
  entryComponents: []
})
export class HomeModule {
}
