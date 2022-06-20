import { CreditCardValidatorDirective } from './credit-card-validator.directive';
import { CardExpiryValidatorDirective } from './card-expiry-validator.directive';
import { CardCvvValidatorDirective } from './card-cvv-validator.directive';
import {PhoneNumberValidatorDirective} from '@snowl/base-app/user/validators/phone-number-validator.directive';

export * from './credit-card-validator.directive';
export * from './card-expiry-validator.directive';
export * from './card-cvv-validator.directive';

export const USER_VALIDATORS = [CreditCardValidatorDirective, CardExpiryValidatorDirective, CardCvvValidatorDirective, PhoneNumberValidatorDirective];
