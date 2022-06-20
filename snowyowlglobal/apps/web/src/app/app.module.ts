import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { MetaReducer, StoreModule } from '@ngrx/store';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { EffectsModule , ofType} from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { storeFreeze } from 'ngrx-store-freeze';
import { BASE_APP_EFFECTS } from '@snowl/app-store/effects';
import { BaseHttpService } from '@snowl/base-app/shared/services/base-http.service';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import {appMetaReducers, appReducers, AppState, CustomSerializer} from '@snowl/app-store/reducers';
import { APP_EFFECTS } from './store/effects';
import {LoggedInGuard, LoggedInIfNecessaryGuard, LoggedOutGuard} from '@snowl/base-app/guards';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';
import { SupportComponent } from './support/support.component';
import {MockModule} from "@snowl/mock/mock.module";
import {environment} from "@snowl/environments/environment";
import {PasswordResetComponent} from 'apps/web/src/app/password-reset/password-reset.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home/games',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    canActivate: [LoggedInIfNecessaryGuard]
  },
  {
    path: 'game',
    loadChildren: () => import('./game/game.module').then(m => m.GameModule),
    canActivate: [LoggedInIfNecessaryGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canActivate: [LoggedOutGuard]
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
    canActivate: [LoggedInGuard]
  },
  {
    path: 'privacy',
    component: PrivacyComponent
  },
  {
    path: 'terms',
    component: TermsComponent
  }, 
  {
    path: 'termsAndConditions',
    component: TermsComponent
  },
  {
    path: 'signup',
    redirectTo: 'auth/signup'
  },
  {
    path: 'login',
    redirectTo: 'auth/login'
  },
  {
    path: 'support',
    component: SupportComponent
  },
  {
    path: 'password-reset',
    component: PasswordResetComponent
  },
  {
    path: '**',
    redirectTo: '/home/games'
  }
];
const metaReducers: MetaReducer<AppState, any>[] = environment.production ? appMetaReducers : [storeFreeze, ...appMetaReducers];
const extraImports: any[] = [];
if (environment.mock) {
  extraImports.push(MockModule.forRoot())
}

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    StoreModule.forRoot(appReducers, { metaReducers: metaReducers }),
    EffectsModule.forRoot([...BASE_APP_EFFECTS, ...APP_EFFECTS]),
    StoreRouterConnectingModule.forRoot(),
    HttpClientModule,
    HttpClientJsonpModule,
    environment.production ? [] : StoreDevtoolsModule.instrument(),
    SharedModule.forRoot(),
    ...extraImports
  ],
  providers: [{ provide: RouterStateSerializer, useClass: CustomSerializer }],
  declarations: [AppComponent, PrivacyComponent, TermsComponent, SupportComponent, PasswordResetComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
