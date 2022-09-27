import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateDogPage } from './update-dog.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateDogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateDogPageRoutingModule {}
