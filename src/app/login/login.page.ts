import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthenticationService } from '../common/services/authentication.service';
import { Router } from '@angular/router';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { gmailValidator } from '../common/validators/validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  loginForm: FormGroup;
  passwordType: string = 'password'; // Estado de visibilidad de la contraseña
  passwordIcon: string = 'eye-off'; // Icono por defecto
  emailError: boolean = false; // Control del error de email
  showErrorAlert: boolean = false; // Control del modal de error
  alertButtons = [
    {
      text: 'Cerrar',
      role: 'cancel',
      cssClass: 'alert-button-red',
    },
  ];
  

  constructor(
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public authService: AuthenticationService,
    public router: Router,
    public alertController: AlertController // Inyectamos AlertController
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, gmailValidator()]],
      password: ['', [Validators.required]],
    });

    console.log('LoginForm inicializado:', this.loginForm); // Debug
  }

  // Método para alternar la visibilidad de la contraseña
  togglePasswordVisibility() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.passwordIcon = 'eye';
    } else {
      this.passwordType = 'password';
      this.passwordIcon = 'eye-off';
    }
  }
  
  // Método para mostrar la alerta
async presentErrorAlert(message: string) {
  const alert = await this.alertController.create({
    header: 'Error',
    message: message,
    buttons: this.alertButtons,
  });

  await alert.present();
}

  get errorControl() {
    return this.loginForm.controls;
  }

  // Método de login con validación de dominio Gmail
  async login() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
  
    if (this.loginForm.valid) {
      try {
        const userCredential = await this.authService.loginUser(
          this.loginForm.value.email,
          this.loginForm.value.password
        );
  
        if (userCredential) {
          loading.dismiss();
          this.router.navigate(['/home']);
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        loading.dismiss();
        this.showErrorAlert = true; // Mostrar alerta si hay error
        await this.presentErrorAlert('Credenciales incorrectas. Por favor, verifica tu email y contraseña.'); // Muestra el mensaje de error
      }
    } else {
      // Mostrar qué campos son inválidos
      Object.keys(this.loginForm.controls).forEach((field) => {
        const control = this.loginForm.get(field);
        if (control?.invalid) {
          console.log(`${field} es inválido`);
        }
      });
      console.log('Proporcione valores correctos');
      loading.dismiss();
      await this.presentErrorAlert('Por favor, completa todos los campos correctamente.'); // Mensaje de alerta para campos inválidos
    }
  }
  
}
