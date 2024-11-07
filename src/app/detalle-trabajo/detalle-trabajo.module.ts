import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleTrabajoPageRoutingModule } from './detalle-trabajo-routing.module';

import { DetalleTrabajoPage } from './detalle-trabajo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleTrabajoPageRoutingModule
  ],
  declarations: [DetalleTrabajoPage]
})
export class DetalleTrabajoPageModule {}
