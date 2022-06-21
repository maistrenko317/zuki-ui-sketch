import { AbstractControl, NG_VALIDATORS, NgModel, ValidationErrors, Validator } from '@angular/forms';
import { Directive, EventEmitter, Input, Output } from '@angular/core';
import * as validCard from 'card-validator';

@Directive({
  selector: '[shShouldEqual]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ShouldEqualValidatorDirective, multi: true }]
})
export class ShouldEqualValidatorDirective implements Validator {
  @Input() shShouldEqual: any;
  validate(c: AbstractControl): ValidationErrors | null {
    return this.shShouldEqual === c.value ? null : { shouldEqual: true };
  }

}
