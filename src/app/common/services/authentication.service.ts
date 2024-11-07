import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database'; // Importar AngularFireDatabase
import { ref, set, get } from '@firebase/database'; // Importar set y get para obtener y guardar datos
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    public ngFireAuth: AngularFireAuth,
    private db: AngularFireDatabase, // Inyectar AngularFireDatabase
    private router: Router,
    private toastController: ToastController
  ) {}

  async registerUser(email: string, password: string, additionalData: any) {
    // Crear usuario
    const userCredential = await this.ngFireAuth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Guardar datos adicionales en Realtime Database
    if (user) {
      await set(ref(this.db.database, 'users/' + user.uid), {
        email: user.email,
        ...additionalData, // Aquí se pueden agregar más datos si es necesario
      });
    }

    return userCredential;
  }

  async loginUser(email: string, password: string) {
    return await this.ngFireAuth.signInWithEmailAndPassword(email, password);
  }

  async signOut() {
    return await this.ngFireAuth.signOut();
  }

  async getProfile() {
    return await this.ngFireAuth.currentUser;
  }

  async getUserData(userId: string) {
    const userRef = ref(this.db.database, 'users/' + userId); // Referencia a la ubicación del usuario
    return await get(userRef); // Obtiene los datos del usuario
  }

  // Métodos para el reset de contraseña

  async resetPass(email: string): Promise<void> {
    try {
      // Envío del correo de recuperación de contraseña con Firebase Auth
      await this.ngFireAuth.sendPasswordResetEmail(email);

      // Guarda el estado en Realtime Database
      const userRef = this.db.object(`RecuperarContrasena/${btoa(email)}`);
      userRef.set({
        email,
        requestDate: new Date().toISOString(),
        status: 'pending',
      });

      this.presentToast('Correo de recuperación enviado', 'success');
    } catch (error) {
      console.error('Error al enviar el correo de recuperación', error);
      this.presentToast('Error al enviar el correo', 'danger');
    }
  }

  // Método para mostrar un mensaje de toast
  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 2000,
    });
    toast.present();
  }

  // Método para verificar el estado de la solicitud de recuperación en la base de datos
  getRecoveryStatus(email: string) {
    const userRef = this.db.object(`RecuperarContrasena/${btoa(email)}`);
    return userRef.valueChanges(); // Devuelve un observable para escuchar los cambios
  }

  async resetPassword(email: string) {
    return await this.ngFireAuth.sendPasswordResetEmail(email);
  }
  
  getCurrentUser() {
    return this.ngFireAuth.authState;
  }
}
