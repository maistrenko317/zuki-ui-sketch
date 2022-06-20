import { EventEmitter, Injectable, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
  BankAccount,
  CardData,
  CreditCard,
  Echeck,
  EcheckForm,
  Subscriber,
  SubscriberAddress,
  VenueItem
} from '@snowl/base-app/model';
import { PaymentMethod } from '@snowl/base-app/user';
import { Country } from '@snowl/base-app/model/country';

@Injectable()
export abstract class BaseAddMoneyStepperComponent {
  @Input() venueItems: VenueItem[];
  @Input() loadingVenueItems: boolean;
  @Input() countries: Country[];

  @Input() billingAddresses: SubscriberAddress[];
  @Input() bankAccounts: BankAccount[];

  @Input() creditCards: CreditCard[];

  @Input() subscriber: Subscriber;

  @Output() purchase = new EventEmitter<{ method: PaymentMethod; item: VenueItem }>();

  selectedPaymentMethod: PaymentMethod;
  selectedItem?: VenueItem;
  newCard = new CardData();
  echeck = new EcheckForm();

  maskCard(card: CardData | CreditCard): string {
    if (!card) {
      return '';
    }

    if (card instanceof CardData) {
      return card.cardNumber.replace(/[\d\s]*(?=\d{4})/g, '****');
    } else {
      return `**** **** **** ${card.number}`;
    }
  }

  sendPurchase(): void {
    this.purchase.next({ method: this.selectedPaymentMethod, item: this.selectedItem! });
  }
}
