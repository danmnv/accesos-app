import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dash.page';
import { HomeComponent } from '../components/home/home.component';
import { RecordComponent } from '../components/record/record.component';
import { AccountComponent } from '../components/account/account.component';

const routes: Routes = [
  {
    path: '',
    component: Dashboard,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'record',
        component: RecordComponent
      },
      {
        path: 'account',
        component: AccountComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
