import { AbstractControl, ValidatorFn } from '@angular/forms';

// Validador personalizado para verificar "@" y "."
export function gmailValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const email = control.value;
    const valid = /^.+@.+\..+$/.test(email); // Verifica si contiene al menos un @ y un .
    return valid ? null : { invalidGmail: true }; // Devuelve error si no es válido
  };
}