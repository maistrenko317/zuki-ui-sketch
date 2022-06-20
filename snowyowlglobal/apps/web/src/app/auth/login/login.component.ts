import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BaseLoginComponent } from '@snowl/base-app/auth/base-login.component';
import {environment} from '@snowl/environments/environment';

@Component({
  selector: 'sh-login',
  templateUrl: './login.component.html',
  styleUrls: ['../login-signup.component.scss'],
 // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent extends BaseLoginComponent {
}
