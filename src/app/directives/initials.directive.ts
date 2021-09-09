import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[appInitials]',
  providers: [{provide: NG_VALIDATORS, useExisting: InitialsValidatorDirective, multi: true}]
})
export class InitialsValidatorDirective implements Validator {
  @Input('appInitials') initials = '';

  validate(control: AbstractControl): ValidationErrors | null {
    return this.initials ? initialsValidator(new RegExp('^' + this.initials,"i"))(control)
      : null;
  }

}

export function initialsValidator(initial: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if(!control.value) return null;
    const forbidden = !initial.test(control.value);
    return forbidden ? { forbiddenInitial: { value: control.value } } : null;
  };
}
