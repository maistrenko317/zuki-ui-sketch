import { AbstractControl, NG_VALIDATORS, NgModel, ValidationErrors, Validator } from '@angular/forms';
import { Directive, EventEmitter, Input, Output } from '@angular/core';
import {parseNumber} from '@snowl/base-app/util';

@Directive({
  selector: '[shMax]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MaxValidatorDirective, multi: true }]
})
export class MaxValidatorDirective implements Validator {
  @Input() shMax: number;

  validate(c: AbstractControl): ValidationErrors | null {
    return parseNumber(c.value) <= this.shMax ? null : { maxValue: true };
  }

}
