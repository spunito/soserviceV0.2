import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CrearServicioPageRoutingModule } from './crear-servicio-routing.module';
import { CrearServicioPage } from './crear-servicio.page'; // Asegúrate de importar el componente correctamente

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearServicioPageRoutingModule
  ],
  declarations: [CrearServicioPage], // Declara CrearServicioPage aquí
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Para evitar errores con los componentes de Ionic
})
export class CrearServicioPageModule {}
