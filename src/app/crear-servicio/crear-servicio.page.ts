import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Capacitor } from '@capacitor/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-crear-servicio',
  templateUrl: './crear-servicio.page.html',
  styleUrls: ['./crear-servicio.page.scss'],
})
export class CrearServicioPage implements OnInit {
  currentStep: number = 1; // Controla el paso actual
  totalSteps: number = 6; // Define el total de pasos
  categoriaSelec: any = null; // Almacena la categoría seleccionada
  trabajosPosteados: Observable<any[]>; // Observable para los trabajos posteados
  image: any;

  // Datos del formulario
  formData = {
    descripcionTrabajo: '',
    requerimientos: '',
    imageUrl: '',
    imageUrl2: '',
    imageUrl3: '',
    pago:''
  };

  // Lista de categorías con imágenes predefinidas
  categorias = [
    { name: 'Pasear Perros', image: 'assets/logo/perroicono.png' },
    { name: 'Otros', image: 'assets/logo/otros.png' },
    { name: 'Gasfiter', image: 'assets/logo/gasfiter.png' },
    { name: 'Limpiar', image: 'assets/logo/clean.png' },
    { name: 'Electrico', image: 'assets/logo/electrico.png' },
    { name: 'Tecnico', image: 'assets/logo/informatico.png' },
  ];

  // Definición de los pasos para el stepper
  steps = [
    'Seleccionar Categoría',
    'Descripción del Trabajo',
    'Requisitos',
    'Toma una Foto',
    'Pon tu Presupuesto',
    'Confirmación'
  ];

  constructor(
    private navCtrl: NavController,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
    private afAuth: AngularFireAuth,
  ) {
    // Recuperar los trabajos posteados desde Firebase
    this.trabajosPosteados = this.db.list('trabajosPosteados').valueChanges();
  }
  goToHome() {
    this.navCtrl.navigateRoot('/home');
  }

  ngOnInit() {}

  async takePicture(slot: number) {
    try {
      if (Capacitor.getPlatform() !== 'web') await Camera.requestPermissions();
      const image = await Camera.getPhoto({
        quality: 90,
        source: CameraSource.Prompt,
        width: 600,
        resultType: CameraResultType.DataUrl,
      });
      this.image = image.dataUrl;
      const blob = this.dataURLtoBlob(image.dataUrl);
      const url = await this.uploadImage(blob);
      if (slot === 1) {
        this.formData.imageUrl = url;
      } else if (slot === 2) {
        this.formData.imageUrl2 = url;
      } else if (slot === 3) {
        this.formData.imageUrl3 = url;
      }
     // Asigna la URL al campo imageUrl de formData
    } catch (e) {
      console.log(e);
    }
  }

  dataURLtoBlob(dataurl: any) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  async uploadImage(blob: any) {
    const currentDate = Date.now();
    const filePath = `test/${currentDate}.jpeg`;
    const task = await this.storage.upload(filePath, blob);
    const url = await this.storage.ref(filePath).getDownloadURL().toPromise();
    return url;
  }

  // Avanzar al siguiente paso
  nextStep() {
    if (this.currentStep === 1 && !this.categoriaSelec) {
      alert('Por favor, selecciona una categoría');
      return;
    }
    if (this.currentStep === 2 && !this.formData.descripcionTrabajo) {
      alert('Por favor, ingresa la descripción del trabajo');
      return;
    }
    if (this.currentStep === 3 && !this.formData.requerimientos) {
      alert('Por favor, ingresa los requisitos');
      return;
    }
    if (this.currentStep === 4 && !this.formData.imageUrl) {
      alert('Por favor, toma una foto');
      return;
    }
    if (this.currentStep === 5 && !this.formData.pago) {
      alert('Por favor, establece tu presupuesto');
      return;
    }
    if (this.currentStep < this.totalSteps) { // Cambia a totalSteps para la confirmación
      this.currentStep++;
    }
  }

  // Retroceder al paso anterior
  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  

  // Verificar si es el último paso
  isLastStep(): boolean {
    return this.currentStep === this.totalSteps;
  }

  // Seleccionar la categoría
  selecCategoria(categoria: any) {
    this.categoriaSelec = categoria;
  }

  // Enviar el formulario
  submitForm() {
    if (this.formData.descripcionTrabajo && this.formData.requerimientos && this.categoriaSelec && this.formData.imageUrl && this.formData.pago) {
      this.afAuth.currentUser.then(user => {
        if (user) {
          const formDataToSave = {
            ...this.formData,
            categoria: this.categoriaSelec.name,
            timestamp: new Date().toISOString(),
            creadorId: user.uid
          };

          // Guardar datos en Firebase
          this.db.list('trabajosPosteados').push(formDataToSave)
            .then(() => {
              alert('Formulario enviado con éxito');
              this.resetForm();
            })
            .catch(err => {
              console.error(err);
              alert('Error al enviar el formulario');
            });
        }
      });
    } else {
      alert('Por favor, completa todos los campos requeridos.');
    }
  }

  // Resetear el formulario
  resetForm() {
    this.formData = {
      descripcionTrabajo: '',
      requerimientos: '',
      imageUrl: '',
      imageUrl2: '',
      imageUrl3: '',
      pago:'',
    };
    this.categoriaSelec = null;
    this.currentStep = 1; // Regresar al primer paso
    this.image = null; // Limpiar la imagen
  }

  goBack() {
    this.navCtrl.back();
  }

  closePage() {
    // Implementar la lógica para cerrar la página
  }
  allowOnlyNumbers(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'];
    if (!/[0-9]/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
  // Función para formatear el pago
formatPayment(event: any) {
  const inputValue = event.target.value;

  // Eliminar todos los caracteres no numéricos
  const numericValue = inputValue.replace(/[^0-9]/g, '');

  // Si el valor numérico está vacío, limpiar el campo
  if (!numericValue) {
    this.formData.pago = '';
    return;
  }

  // Convertir a número y formatear en formato monetario
  const formattedValue = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(parseInt(numericValue));
  this.formData.pago = formattedValue;

  // También actualizar el valor del input para que se refleje correctamente
  event.target.value = numericValue;
}

  
}
