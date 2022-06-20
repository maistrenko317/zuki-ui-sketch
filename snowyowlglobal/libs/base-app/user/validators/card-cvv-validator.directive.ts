import { AbstractControl, NG_VALIDATORS, NgModel, ValidationErrors, Validator } from '@angular/forms';
import { Directive, EventEmitter, Input, Output } from '@angular/core';
import * as validCard from 'card-validator';

@Directive({
  selector: '[shCardCvv]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CardCvvValidatorDirective, multi: true }]
})
export class CardCvvValidatorDirective implements Validator {
  @Input() isAmex = false; // TODO: if isAmex is changed this should be revalidated

  validate(c: AbstractControl): ValidationErrors | null {
    const validated = this.handleCvv(c);

    return validated ? null : { cardExpiry: true };
  }

  private handleCvv(c: AbstractControl): boolean {
    const oldValue = c.value;
    if (!oldValue) {
      return false;
    }

    let value = oldValue.replace(/[^0-9]/g, '');

    const validated = validCard.cvv(value, this.isAmex ? 4 : 3);

    if (value.length > 4) value = value.slice(0, 4);

    if (value !== oldValue) c.setValue(value);

    return validated.isValid;
  }
}
