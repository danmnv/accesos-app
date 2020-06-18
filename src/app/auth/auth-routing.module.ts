import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Authenticate } from './auth.page';
import { RegisterComponent } from '../components/register/register.component';

const routes: Routes = [
  {
    path: 'login',
    component: Authenticate,
  },
  {
    path: 'register',
    component: RegisterComponent
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