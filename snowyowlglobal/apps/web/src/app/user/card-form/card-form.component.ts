import { Component, OnInit } from '@angular/core';
import { BaseCardFormComponent } from '@snowl/base-app/user';
import {IconName, IconProp} from '@fortawesome/fontawesome-svg-core';

// - master-card
// - american-express
// - visa
// - diners-club
// - discover
// - jcb
// - unionpay
// - maestro
const cardNames: Dict<IconName> = {
  'master-card': 'cc-mastercard',
  'american-express': 'cc-amex',
  'visa': 'cc-visa',
  'diners-club': 'cc-diners-club',
  'discover': 'cc-discover',
  'jcb': 'cc-jcb',
  // 'unionpay': 'cc-unionpay',
  // 'maestro': 'cc-maestro',
};

@Component({
  selector: 'sh-card-form',
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.scss']
})
export class CardFormComponent extends BaseCardFormComponent {
  getCardIcon(cardType: string): IconProp {
    if (!cardType) return 'credit-card';

    const iconName = cardNames[cardType];

    if (!iconName) {
      return 'credit-card';
    }

    return ['fab', iconName];
  }
}
