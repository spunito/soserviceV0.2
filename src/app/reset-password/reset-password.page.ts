import { Component , OnInit } from '@angular/core';
import { AuthenticationService } from '../common/services/authentication.service';
import { LoadingController, NavController } from '@ionic/angular';



@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage  {
  email: string = '';
  recoveryStatus: any;

  constructor(private navCtrl: NavController , private authService: AuthenticationService) {}

  onSubmit() {
    if (this.email) {
      this.authService.resetPass(this.email);
      // Escucha los cambios en la base de datos para obtener el estado de la solicitud
      this.authService.getRecoveryStatus(this.email).subscribe((status) => {
        this.recoveryStatus = status;
      });
    }
  }
  goBack() {
    this.navCtrl.back(); // Regresa a la página anterior (Inicio de sesión)
  }
}
