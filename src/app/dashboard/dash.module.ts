import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Dashboard } from './dash.page';

import { DashboardRoutingModule } from './dash-routing.module';

import { AccountComponent } from '../components/account/account.component';
import { HomeComponent } from '../components/home/home.component';

import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardRoutingModule,
    QRCodeModule
  ],
  declarations: [Dashboard, HomeComponent, AccountComponent]
})
export class DashboardModule {}
