import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import {SignupEmailComponent} from "./signup-email/signup-email.component";
import {SignupNicknameComponent} from "./signup-nickname/signup-nickname.component";
import {SignupPasswordComponent} from "./signup-password/signup-password.component";
import {SignupBirthdayComponent} from "./signup-birthday/signup-birthday.component";
import {SignupLocationComponent} from "./signup-location/signup-location.component";
import {ForgotPasswordComponent} from 'apps/web/src/app/auth/forgot-password/forgot-password.component';

const routes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: 'signup', component: SignupEmailComponent },
  { path: 'signup-nickname', component: SignupNicknameComponent },
  { path: 'signup-location', component: SignupLocationComponent },
  { path: 'signup-birthday', component: SignupBirthdayComponent },
  { path: 'signup-pass', component: SignupPasswordComponent }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
  declarations: [LoginComponent, ForgotPasswordComponent, SignupEmailComponent, SignupNicknameComponent, SignupLocationComponent, SignupBirthdayComponent, SignupPasswordComponent]
})
export class AuthModule {}
