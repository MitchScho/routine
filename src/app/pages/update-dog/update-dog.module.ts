import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateDogPageRoutingModule } from './update-dog-routing.module';

import { UpdateDogPage } from './update-dog.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateDogPageRoutingModule
  ],
  declarations: [UpdateDogPage]
})
export class UpdateDogPageModule {}
