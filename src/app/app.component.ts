import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle'; 
import { AngularFireAuth } from '@angular/fire/compat/auth';
register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private afAuth: AngularFireAuth) {
    // Suscribirse a los cambios de autenticación
    this.afAuth.authState.subscribe(user => {
      if (user) {
        console.log("Usuario conectado:", user);
        // Puedes almacenar el usuario en un servicio compartido si necesitas acceder en otras páginas
      } else {
        console.log("Usuario no conectado");
        // Redirigir al login o a una página de acceso según tu necesidad
      }
      this.afAuth.setPersistence('local');
    });
}
}