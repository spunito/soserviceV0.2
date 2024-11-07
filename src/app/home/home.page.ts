import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../common/services/authentication.service';
import { AngularFireAuth } from '@angular/fire/compat/auth'; 
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  userName: string | null = null;
  profilePhotoUrl: string | null = null;
  trabajosPosteados: any[] = [];

  constructor(
    private authService: AuthenticationService,
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router
  ) {}

  ngOnInit() {
    // Verificar el estado de autenticación para cargar los datos del usuario
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.loadUserData(user.uid); // Cargar datos del usuario si está autenticado
      } else {
        this.router.navigate(['/login']); // Redirigir al login si no está autenticado
      }
    });
    this.getTrabajosPosteados();
  }

  async loadUserData(userId: string) {
    const userData = await this.authService.getUserData(userId);
    if (userData.exists()) {
      const data = userData.val();
      this.userName = data.name || 'Usuario';
      this.profilePhotoUrl = data.profilePhotoUrl || 'assets/default-profile.png'; // Imagen por defecto si no hay foto
    }
  }

  getTrabajosPosteados() {
    this.db
      .list('trabajosPosteados')
      .snapshotChanges()
      .subscribe((trabajos: any[]) => {
        this.trabajosPosteados = trabajos.map((trabajo) => {
          const data = trabajo.payload.val();
          const id = trabajo.payload.key;
          return { id, ...data };
        });

        this.trabajosPosteados.forEach((trabajo) => {
          if (trabajo.creadorId) {
            this.db
              .object(`users/${trabajo.creadorId}`)
              .valueChanges()
              .subscribe((userData: any) => {
                if (userData) {
                  trabajo.creadorNombre = `${userData.name} ${userData.lastName} ${userData.lastnamef}`;
                }
              });
          }
        });
      });
  }

  async logout() {
    try {
      await this.afAuth.signOut();
      console.log("Usuario deslogueado");
      this.router.navigate(['/login']);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }
  goToDetalleTrabajo(trabajo: any) {
    this.router.navigate(['/detalle-trabajo'], { state: { trabajo } }); // Navegar a la página "Detalle Trabajo" con los datos del trabajo
  }
}
