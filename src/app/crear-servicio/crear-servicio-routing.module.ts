import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearServicioPage } from './crear-servicio.page'; // Asegúrate de que esta referencia sea correcta

const routes: Routes = [
  {
    path: '',
    component: CrearServicioPage, // Usa CrearServicioPage en lugar de FormularioSolicitudPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearServicioPageRoutingModule {}
