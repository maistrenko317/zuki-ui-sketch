import { AbstractControl, NG_VALIDATORS, NgModel, ValidationErrors, Validator } from '@angular/forms';
import { Directive, EventEmitter, Input, Output } from '@angular/core';
import * as validCard from 'card-validator';
import {parseNumber} from '@snowl/base-app/util';

@Directive({
  selector: '[shPhoneNumber]',
  providers: [{ provide: NG_VALIDATORS, useExisting: PhoneNumberValidatorDirective, multi: true }]
})
export class PhoneNumberValidatorDirective implements Validator {

  validate(c: AbstractControl): ValidationErrors | null {
    const num =  parseNumber(c.value);
    const correct = num > 0 && num.toString().length === 10;

    return correct ? null : { cardExpiry: true };
  }

}
