import { BaseEcheckFormComponent, states } from '@snowl/base-app/user';
import { Component, Input } from '@angular/core';
import { BankAccount, Echeck, SubscriberAddress } from '@snowl/base-app/model';

@Component({
  selector: 'sh-echeck-form',
  templateUrl: './echeck-form.component.html',
  styleUrls: ['./echeck-form.component.scss']
})
export class EcheckFormComponent extends BaseEcheckFormComponent {
  phoneMask = [/[1-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
}
