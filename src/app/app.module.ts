import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database'; // Asegúrate de importar el módulo de base de datos
import { AuthenticationService } from './common/services/authentication.service'; // Importar el servicio de autenticación
import { AngularFireStorageModule } from '@angular/fire/compat/storage'; // Para almacenamiento
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; 
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    
    AngularFireModule.initializeApp(environment.firebase), // Inicializar Firebase
    AngularFireAuthModule, // Importar Auth
    AngularFireStorageModule, // Importar Storage
    AngularFirestoreModule,
    
    AngularFireDatabaseModule, // Importar Realtime Database
    RouterModule.forRoot([]),
    
  ],
  
  providers: [
    AuthenticationService, // Inyectar el servicio de autenticación
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, 
     provideStorage(() => getStorage()),
     provideFirestore(() => getFirestore()),
     provideAuth(() => getAuth()),
     provideMessaging(() => getMessaging()), // Proporciona Firestore
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
defineCustomElements(window);