import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivityDashboardPage } from './activity-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: ActivityDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivityDashboardPageRoutingModule {}
