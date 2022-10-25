import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateActivityPageRoutingModule } from './update-activity-routing.module';

import { UpdateActivityPage } from './update-activity.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateActivityPageRoutingModule,
    ReactiveFormsModule,

  ],
  declarations: [UpdateActivityPage],
})
export class UpdateActivityPageModule {}
