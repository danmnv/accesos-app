import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Authenticate } from './auth.page';
import { LoginComponent } from '../components/login/login.component';

const routes: Routes = [
  {
    path: '',
    component: Authenticate,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
