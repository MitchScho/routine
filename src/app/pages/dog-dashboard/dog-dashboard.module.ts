import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DogDashboardPageRoutingModule } from './dog-dashboard-routing.module';

import { DogDashboardPage } from './dog-dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DogDashboardPageRoutingModule
  ],
  declarations: [DogDashboardPage]
})
export class DogDashboardPageModule {}
