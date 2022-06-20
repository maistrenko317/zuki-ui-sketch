import { AbstractControl, NG_VALIDATORS, NgModel, ValidationErrors, Validator } from '@angular/forms';
import { Directive, EventEmitter, Output } from '@angular/core';
import * as validCard from 'card-validator';

@Directive({
  selector: '[shCardExpiry]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CardExpiryValidatorDirective, multi: true }]
})
export class CardExpiryValidatorDirective implements Validator {
  @Output() monthChange = new EventEmitter<string>();
  @Output() yearChange = new EventEmitter<string>();

  validate(c: AbstractControl): ValidationErrors | null {
    const validated = this.handleExpiry(c);

    return validated ? null : { cardExpiry: true };
  }

  private handleExpiry(c: AbstractControl): boolean {
    const oldVal = c.value;
    if (!oldVal) return false;

    let value = oldVal.replace(/[^0-9\/]/g, '');

    const validated = validCard.expirationDate(value);

    const noSlash = value.indexOf('/') === -1;
    if (value.length === 2 && noSlash) {
      value = value.slice(0, 2) + '/' + value.slice(2); // Automatically add slash between second and third character
    } else if (value.length === 1 && noSlash && (+value[0] > 1 || (value[0] === '1' && +value[1] > 2))) {
      value = value.slice(0, 1) + '/' + value.slice(1); // Automatically add slash after first character if it isn't a 1 or 0
    }

    if (value.length > 7) value = value.slice(0, 7);

    if (validated.isValid) {
      this.monthChange.emit(validated.month!);
      this.yearChange.emit(validated.year!);
    }

    if (oldVal !== value) {
      c.setValue(value);
    }

    return validated.isValid;
  }
}
