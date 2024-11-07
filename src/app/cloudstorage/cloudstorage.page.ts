import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-cloudstorage',
  templateUrl: './cloudstorage.page.html',
  styleUrls: ['./cloudstorage.page.scss'],
})
export class CloudstoragePage implements OnInit {
  image: any;
  formData = {
    imageUrl: '',
  };

  constructor(
    private storage: AngularFireStorage,
    private firestore: AngularFirestore,
    private db: AngularFireDatabase // Inyección del servicio AngularFireDatabase
  ) {}

  async takePicture() {
    console.log('takePicture called'); // Agrega esto para verificar si se llama
    try {
      if (Capacitor.getPlatform() !== 'web') await Camera.requestPermissions();
      const image = await Camera.getPhoto({
        quality: 90,
        source: CameraSource.Prompt,
        width: 600,
        resultType: CameraResultType.DataUrl,
      });
      console.log('image: ', image);
      this.image = image.dataUrl;
      const blob = this.dataURLtoBlob(image.dataUrl);
      const url = await this.uploadImage(blob, image);
      console.log(url);
      this.formData.imageUrl = url; // Asigna la URL al campo imageUrl de formData
      await this.saveImageDataToRealtimeDatabase();
      console.log('Image data saved to Realtime Database');
    } catch (e) {
      console.log('Error taking picture:', e); // Captura cualquier error
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

  async uploadImage(blob: any, imageData: any) {
    try {
      const currentDate = Date.now();
      const filePath = `test/${currentDate}.jpeg`;
      const fileRef = this.storage.ref(filePath);
      const task = await this.storage.upload(filePath, blob);
      console.log('task: ', task);
      const url = await fileRef.getDownloadURL().toPromise();
      return url;
    } catch (e) {
      throw e;
    }
  }

  async saveImageDataToRealtimeDatabase() {
    try {
      if (this.formData.imageUrl) {
        // Guardar formData en Firebase Realtime Database
        await this.db.list('imagenesSubidas').push(this.formData);
        console.log('Image data saved successfully to Realtime Database');
      } else {
        console.log('No image URL to save');
      }
    } catch (e) {
      console.log('Error saving image data to Realtime Database:', e);
    }
  }

  ngOnInit() {}
}
