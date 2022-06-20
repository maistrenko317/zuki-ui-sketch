import { AbstractControl, NG_VALIDATORS, NgModel, ValidationErrors, Validator } from '@angular/forms';
import { Directive } from '@angular/core';
import * as validCard from 'card-validator';

@Directive({
  selector: '[shCreditCard]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CreditCardValidatorDirective, multi: true }],
  exportAs: 'shCreditCard'
})
export class CreditCardValidatorDirective implements Validator {
  public cardType?: string;
  public cardCodeType = 'CVC';
  public isAmex = false;
  public codePlaceholder = '***';
  public codeSize = 3;

  validate(c: AbstractControl): ValidationErrors | null {
    const validated = this.handleCard(c);

    return validated ? null : { creditCard: true };
  }

  private handleCard(c: AbstractControl): boolean {
    const oldVal = c.value;
    if (!oldVal) return false;

    let value = oldVal.replace(/[^0-9]/g, '');
    const validated = validCard.number(value);

    if (validated.card) {
      this.cardType = validated.card.type;
      this.cardCodeType = validated.card.code.name;
      this.isAmex = validated.card.isAmex;
      this.codeSize = validated.card.code.size;
      this.codePlaceholder = '';

      for (let i = 0; i < validated.card.code.size; i++) {
        this.codePlaceholder += '*';
      }

      let offset = 0;
      for (let gap of validated.card.gaps) {
        gap += offset;
        if (value.length > gap && value[gap] !== ' ') {
          value = value.slice(0, gap) + ' ' + value.slice(gap);
        }
        offset++;
      }

      const max = Math.max(...validated.card.lengths) + offset;

      if (value.length > max) {
        value = value.slice(0, max);
      }
    } else {
      this.cardType = undefined;
      this.cardCodeType = 'CVC';
      this.isAmex = false;
    }

    if (oldVal !== value) {
      c.setValue(value);
    }

    return validated.isValid;
  }
}
