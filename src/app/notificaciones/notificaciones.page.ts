import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ChangeDetectorRef } from '@angular/core'; 
@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {
  notificaciones: any[] = []; // Array para almacenar las notificaciones

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarNotificaciones();
  }

  // Método para cargar las notificaciones del usuario actual
  cargarNotificaciones() {
    this.afAuth.currentUser.then((user) => {
      if (user) {
        const userId = user.uid;
        this.db.list(`notificaciones/${userId}`).valueChanges().subscribe((data: any[]) => {
          this.notificaciones = data;
          console.log('Notificaciones cargadas:', this.notificaciones); // Debug
          this.cdr.detectChanges(); // Manually trigger change detection
        });
      }
    });
  }

  async contratarUsuario(notificacion: any) {
    // Imprimir la notificación para depuración
    console.log('Notificación:', notificacion);
    console.log('Interesado ID:', notificacion.interesadoId);
    console.log('Trabajo ID:', notificacion.trabajoId);

    if (!notificacion.interesadoId || !notificacion.trabajoId) {
      console.error('Datos incompletos para la contratación.');
      return;
    }

    const trabajoId = notificacion.trabajoId;

    try {
      // Verificar si el trabajo ya está contratado
      const trabajoRef = this.db.object(`trabajosPosteados/${trabajoId}`).query;
      const trabajoData = await trabajoRef.once('value');
      const trabajo = trabajoData.val();

      if (trabajo && trabajo.trabajoContratado) {
        alert('Este trabajo ya ha sido contratado.');
        return; // No permitir contratar si ya fue contratado
      }

      // Crear el objeto de contratación
      const contrato = {
        usuarioId: notificacion.interesadoId, // ID del usuario interesado
        trabajoId: notificacion.trabajoId, // ID del trabajo
        estado: 'contratado', // Estado del contrato
        timestamp: Date.now(), // Marca de tiempo
      };

      // Guardar la contratación en Firebase
      await this.db.list(`contratos/${trabajoId}`).push(contrato);

      // Actualizar el trabajo como contratado en Firebase
      await this.db.object(`trabajosPosteados/${trabajoId}`).update({
        trabajoContratado: true,
      });

      // Actualizar la notificación para reflejar que el trabajo ha sido contratado
      await this.db.object(`notificaciones/${notificacion.interesadoId}`).update({
        trabajoContratado: true,
      });

      // Recargar las notificaciones para reflejar los cambios en la vista
      this.cargarNotificaciones();

      // Manually trigger change detection after updating the notifications
      this.cdr.detectChanges();

      alert('Usuario contratado exitosamente.');

    } catch (error) {
      console.error('Error durante la contratación:', error);
    }
  }

  mostrarTrabajador(notificacion: any) {
    if (notificacion.interesadoId) {
      this.db.object(`users/${notificacion.interesadoId}`).valueChanges().subscribe((userData: any) => {
        if (userData) {
          alert(`Nombre: ${userData.name} ${userData.lastName} ${userData.lastnamef}\nEmail: ${userData.email}\nTeléfono: ${userData.phone}\nRUT: ${userData.rut}\nHabilidades: ${userData.skills}`);
        }
      });
    }
  }

  async verificarTrabajoContratado(trabajoId: string): Promise<boolean> {
    const trabajoData = await this.db.object(`trabajosPosteados/${trabajoId}`).query.once('value');
    const trabajo = trabajoData.val();
    return trabajo ? trabajo.trabajoContratado : false;
  }
}
