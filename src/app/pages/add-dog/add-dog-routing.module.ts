import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddDogPage } from './add-dog.page';

const routes: Routes = [
  {
    path: '',
    component: AddDogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddDogPageRoutingModule {}
