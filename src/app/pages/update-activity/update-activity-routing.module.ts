import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateActivityPage } from './update-activity.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateActivityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateActivityPageRoutingModule {}
