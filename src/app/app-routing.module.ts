import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'create-account',
    loadChildren: () => import('./pages/create-account/create-account.module').then( m => m.CreateAccountPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'dog-dashboard',
    loadChildren: () => import('./pages/dog-dashboard/dog-dashboard.module').then( m => m.DogDashboardPageModule)
  },
  {
    path: 'add-dog',
    loadChildren: () => import('./pages/add-dog/add-dog.module').then( m => m.AddDogPageModule)
  },
  {
    path: 'update-dog',
    loadChildren: () => import('./pages/update-dog/update-dog.module').then( m => m.UpdateDogPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
