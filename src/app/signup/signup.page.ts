import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../common/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  regForm: FormGroup;

  constructor(
    private navCtrl: NavController,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public authService: AuthenticationService,
    public router: Router
  ) {
    const today = new Date();
  }

  ngOnInit(): void {
    this.regForm = this.formBuilder.group({
      name: ['', [Validators.required,Validators.maxLength(15)]],
      lastnamem: ['', [Validators.required,Validators.maxLength(15)]],
      lastnamef: ['', [Validators.required,Validators.maxLength(15)]],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$"),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"),
        ],
      ],
      confirmPassword: ['', Validators.required],
      rut: ['', [Validators.required, this.rutLengthValidator.bind(this)]],
      skills: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]*$")]], // Nuevo campo para teléfono
    });
  }

  onDateChange(event: any) {
    const selectedDate = event.detail.value;
    this.regForm.get('birthdate')?.setValue(selectedDate);
  }

  get errorControl() {
    return this.regForm?.controls;
  }
  rutLengthValidator(control: any): { [key: string]: boolean } | null {
    const rut = control.value?.replace(/[^0-9kK]/g, ''); // Eliminar caracteres no numéricos o K
    if (rut.length < 8 || rut.length > 9) {
      return { invalidRUTLength: true };
    }
    return null;
  }
  formatRUT() {
    let rut = this.regForm.get('rut')?.value || '';
    rut = rut.replace(/[^0-9kK]/g, ''); // Permitir solo números y 'K'

    if (rut.length > 1) {
      rut = rut.replace(/^(\d{1,2})(\d{3})(\d{3})([\dkK])?$/, '$1.$2.$3-$4');
    }

    this.regForm.get('rut')?.setValue(rut.toUpperCase(), { emitEvent: false });
  }
 
  // Método para formatear la entrada de texto
  formatInput(input: string): string {
    // Convierte la primera letra a mayúscula y el resto a minúsculas
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
  }

  // Actualiza el valor del control del formulario al cambiar el input
  updateInput(controlName: string) {
    const currentValue = this.regForm.get(controlName)?.value;
    if (currentValue) {
      this.regForm.get(controlName)?.setValue(this.formatInput(currentValue), { emitEvent: false });
    }
  }
  async signUp() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    if (this.regForm?.valid) {
        if (this.regForm.value.password !== this.regForm.value.confirmPassword) {
        console.log('Las contraseñas no coinciden');
        loading.dismiss();
        return; // Salir si no coinciden
      }
      try {
        const additionalData = {
          name: this.regForm.value.name,
          lastName: this.regForm.value.lastnamem, // Otros campos adicionales
          lastnamef: this.regForm.value.lastnamef,
          rut: this.regForm.value.rut,
          skills: this.regForm.value.skills,
          phone: this.regForm.value.phone, // Añadir teléfono
        };

        const userCredential = await this.authService.registerUser(
          this.regForm.value.email,
          this.regForm.value.password,
          additionalData // Pasar los datos adicionales
        );

        if (userCredential) {
          loading.dismiss();
          this.router.navigate(['/home']);
        }
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        loading.dismiss();
      }
    } else {
      // Aquí puedes añadir una lógica para mostrar qué campos son inválidos
      Object.keys(this.regForm.controls).forEach(field => {
        const control = this.regForm.get(field);
        if (control?.invalid) {
          console.log(`${field} es inválido`);
        }
      });
      console.log('Proporciona valores correctos');
      loading.dismiss();
    }
  }

  goBack() {
    this.navCtrl.back();
  }
  

  
}


