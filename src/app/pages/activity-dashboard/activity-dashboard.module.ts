import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivityDashboardPageRoutingModule } from './activity-dashboard-routing.module';

import { ActivityDashboardPage } from './activity-dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivityDashboardPageRoutingModule
  ],
  declarations: [ActivityDashboardPage]
})
export class ActivityDashboardPageModule {}
