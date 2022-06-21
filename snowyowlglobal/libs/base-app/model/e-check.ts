import { SubscriberAddress } from './subscriber-address';
import { BankAccount } from './bank-account';

export class Echeck {
  phone: string;
}

export class EcheckForm extends Echeck {
  address = new SubscriberAddress();
  bank = new BankAccount();
}
