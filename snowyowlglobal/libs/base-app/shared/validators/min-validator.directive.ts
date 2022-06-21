import { AbstractControl, NG_VALIDATORS, NgModel, ValidationErrors, Validator } from '@angular/forms';
import { Directive, EventEmitter, Input, Output } from '@angular/core';
import {parseNumber} from '@snowl/base-app/util';

@Directive({
  selector: '[shMin]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MinValidatorDirective, multi: true }]
})
export class MinValidatorDirective implements Validator {
  @Input() shMin: number;

  validate(c: AbstractControl): ValidationErrors | null {
    return parseNumber(c.value) >= this.shMin ? null : { minValue: true };
  }

}
