import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddDogPageRoutingModule } from './add-dog-routing.module';

import { AddDogPage } from './add-dog.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddDogPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [AddDogPage],
})
export class AddDogPageModule {}
