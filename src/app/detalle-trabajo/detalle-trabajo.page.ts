import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-detalle-trabajo',
  templateUrl: './detalle-trabajo.page.html',
  styleUrls: ['./detalle-trabajo.page.scss'],
})
export class DetalleTrabajoPage implements OnInit {
  trabajo: any;
  currentUserName: string | null = null;
  currentUserId: string | null = null;
  trabajoContratado: boolean = false;
  images: string[] = [];

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private navCtrl: NavController,

  ) {}

  ngOnInit() {
    this.initializeData();
  }
  goBack() {
    this.navCtrl.back();
  }

  async initializeData() {
    const navigation = this.router.getCurrentNavigation();
    this.trabajo = navigation?.extras?.state ? navigation.extras.state['trabajo'] : null;
    this.prepareImages(); // Preparar las imágenes al inicializar
    await this.getCurrentUser();
    this.checkContratacion();
  }

  // Obtener el usuario actual
  async getCurrentUser() {
    const user = await this.afAuth.currentUser;
    if (user) {
      this.currentUserId = user.uid;
      this.db.object(`users/${user.uid}`).valueChanges().subscribe((userData: any) => {
        if (userData) {
          this.currentUserName = `${userData.name} ${userData.lastName} ${userData.lastnamef}`;
        }
      });
    }
  }

  checkContratacion() {
    if (this.trabajo?.id) {
      this.db.list(`notificaciones/${this.trabajo.creadorId}`).valueChanges().subscribe((notificaciones: any[]) => {
        const notificacionExistente = notificaciones.find((notificacion) => notificacion.trabajoId === this.trabajo.id && notificacion.trabajoContratado);
        if (notificacionExistente) {
          this.trabajoContratado = true; // Si existe una notificación de contratación, actualizar el estado
        }
      });
    }
  }

  // Expresar interés en el trabajo y notificar al creador
  expresarInteres() {
    if (this.currentUserName && this.currentUserId && this.trabajo.creadorId) {
      const notification = {
        trabajoId: this.trabajo.id || null,
        trabajoCategoria: this.trabajo.categoria,
        interesadoId: this.currentUserId,
        interesadoNombre: this.currentUserName,
        timestamp: Date.now(),
        tipo: 'interes',
        trabajoContratado: false
      };

      // Guardar la notificación en Firebase en la ruta del creador
      this.db.list(`notificaciones/${this.trabajo.creadorId}`).push(notification)
        .then(() => {
          alert('Se ha enviado una notificación al creador.');
          this.contactarCreador(this.trabajo.creadorId); // Llama al método para registrar el contacto
        })
        .catch((error) => {
          console.error('Error al enviar la notificación:', error);
        });
    } else {
      console.error('Información incompleta para enviar la notificación.');
    }
  }

  contactarCreador(creadorId: string) {
    if (this.currentUserName && this.currentUserId) {
      const chatId = this.getChatId(this.currentUserId, creadorId); // Generar el ID del chat
      const contactoData = {
        nombreUsuario: this.currentUserName,
        creadorId: creadorId,
        mensaje: 'Usuario quiere contactarte',
        timestamp: Date.now(),
        chatId: chatId // Guardar el ID del chat
      };

      // Registra el contacto en la base de datos
      this.db.object(`contactos/${creadorId}/${this.currentUserId}`).set(contactoData)
        .then(() => {
          console.log('Notificación de contacto enviada al creador del trabajo.');
          this.irAlChat(chatId); // Redirigir al usuario al chat después de enviar la notificación
        })
        .catch((error) => {
          console.error('Error al enviar notificación de contacto:', error);
        });
    } else {
      console.error('Faltan datos para contactar al creador.');
    }
  }
  prepareImages() {
    if (this.trabajo) {
      this.images = [];
      if (this.trabajo.imageUrl) this.images.push(this.trabajo.imageUrl);
      if (this.trabajo.imageUrl2) this.images.push(this.trabajo.imageUrl2);
      if (this.trabajo.imageUrl3) this.images.push(this.trabajo.imageUrl3);
    }
  }

  contratarUsuario(notificacion: any) {
    if (!this.trabajoContratado) {
      const notificacionContratada = {
        titulo: "Contratación exitosa",
        mensaje: `Has sido contratado para el trabajo de ${this.trabajo.categoria}.`,
        timestamp: Date.now(),
        tipo: 'contratado',
        trabajoId: this.trabajo.id,
        trabajoContratado: true
      };

      this.db.list(`notificaciones/${notificacion.interesadoId}`).push(notificacionContratada)
        .then(() => {
          alert('Se ha contratado al usuario.');
          this.trabajoContratado = true;
          this.db.object(`notificaciones/${this.trabajo.creadorId}/${notificacion.id}`).update({ trabajoContratado: true });
        })
        .catch((error) => {
          console.error('Error al enviar la notificación de contratación:', error);
        });
    } else {
      alert('Este trabajo ya ha sido contratado.');
    }
  }

  irAlChat(chatId: string) { // Modificado para recibir chatId
    if (this.currentUserId && this.trabajo && this.trabajo.creadorId) {
      this.router.navigate(['/chat'], {
        queryParams: {
          usuarioId: this.currentUserId,
          creadorId: this.trabajo.creadorId,
          otherUserId: this.trabajo.creadorId, // Asegúrate de que este ID sea correcto
          chatId: chatId // Pasar el chatId
        }
      });
    }
  }
  

  getChatId(id1: string, id2: string): string {
    // Crear un ID único para el chat combinando los IDs de los usuarios
    return id1 < id2 ? `${id1}_${id2}` : `${id2}_${id1}`;
  }
}
