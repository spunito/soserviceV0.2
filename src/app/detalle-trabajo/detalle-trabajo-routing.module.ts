import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleTrabajoPage } from './detalle-trabajo.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleTrabajoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleTrabajoPageRoutingModule {}
