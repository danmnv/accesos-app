import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Authenticate } from './auth.page';
import { LoginComponent } from '../components/login/login.component';

const routes: Routes = [
  {
    path: 'register',
    component: Authenticate,
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }