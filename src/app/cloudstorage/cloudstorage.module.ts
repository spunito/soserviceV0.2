import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CloudstoragePageRoutingModule } from './cloudstorage-routing.module';

import { CloudstoragePage } from './cloudstorage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CloudstoragePageRoutingModule
  ],
  declarations: [CloudstoragePage]
})
export class CloudstoragePageModule {}
