import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DogDashboardPage } from './dog-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DogDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DogDashboardPageRoutingModule {}
