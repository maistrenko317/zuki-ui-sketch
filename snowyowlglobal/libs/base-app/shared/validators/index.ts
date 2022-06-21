import {ShouldEqualValidatorDirective} from "./should-equal-validator.directive";
import {MinValidatorDirective} from './min-validator.directive';
import {MaxValidatorDirective} from './max-validator.directive';

export * from './should-equal-validator.directive';
export * from './min-validator.directive';
export * from './max-validator.directive';

export const SHARED_VALIDATORS = [ShouldEqualValidatorDirective, MinValidatorDirective, MaxValidatorDirective];
