import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const formGroup = control as FormGroup;
  const newPassword = formGroup.get('newPassword')?.value;
  const confirmedPassword = formGroup.get('confirmedPassword')?.value;
  return newPassword === confirmedPassword ? null : { passwordsMismatch: true };
};
