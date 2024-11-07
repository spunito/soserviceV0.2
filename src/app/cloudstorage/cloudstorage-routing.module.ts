import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CloudstoragePage } from './cloudstorage.page';

const routes: Routes = [
  {
    path: '',
    component: CloudstoragePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CloudstoragePageRoutingModule {}
