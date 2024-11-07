import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { finalize } from 'rxjs/operators';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  profilePhotoUrl: string = 'assets/default.jpg';
  name: string = '';
  email: string = '';
  phone: string = '';

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
    private NavCtrl : NavController,
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.loadUserProfile(user.uid);
      } else {
        console.error("No hay usuario autenticado");
      }
    });
  }

  loadUserProfile(userId: string) {
    this.db.object(`users/${userId}`).valueChanges().subscribe(
      (userData: any) => {
        if (userData) {
          this.name = userData.name || '';
          this.email = userData.email || '';
          this.phone = userData.phone || '';
          this.profilePhotoUrl = userData.profilePhotoUrl || 'assets/default.jpg';
        }
      },
      (error) => console.error("Error al cargar los datos del perfil:", error)
    );
  }

  async changeProfilePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
      });

      if (image?.dataUrl) {
        this.uploadProfilePicture(image.dataUrl);
      }
    } catch (error) {
      console.error("Error al obtener la foto:", error);
    }
  }

  async uploadProfilePicture(dataUrl: string) {
    const user = await this.afAuth.currentUser;
    const userId = user?.uid;

    if (userId) {
      const filePath = `profilePhotos/${userId}`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = fileRef.putString(dataUrl, 'data_url');

      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.profilePhotoUrl = url;
            this.updateUserProfilePhoto(url);
          });
        })
      ).subscribe();
    }
  }

  async updateUserProfilePhoto(url: string) {
    const user = await this.afAuth.currentUser;
    const userId = user?.uid;

    if (userId) {
      await this.db.object(`users/${userId}`).update({ profilePhotoUrl: url });
    }
  }

  async updateUserProfile() {
    const user = await this.afAuth.currentUser;
    const userId = user?.uid;

    if (userId) {
      await this.db.object(`users/${userId}`).update({
        name: this.name,
        email: this.email,
        phone: this.phone,
        profilePhotoUrl: this.profilePhotoUrl,
      });
    }
  }
  goBack() {
    this.NavCtrl.back();
  }
}
