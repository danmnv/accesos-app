import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// Auth Guards
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

// Redirects
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['auth/login']);
const redirectLoggedToDashboard   = () => redirectLoggedInTo(['dashboard/home']);

const routes: Routes = [
  {
    path: 'dashboard',
    ...canActivate(redirectUnauthorizedToLogin),
    loadChildren: () => import('./dashboard/dash.module').then( m => m.DashboardModule)
  },
  {
    path: 'auth',
    ...canActivate(redirectLoggedToDashboard),
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
