import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Authenticate } from './auth.page';

import { AuthRoutingModule } from './auth-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AuthRoutingModule
  ],
  declarations: [Authenticate]
})
export class AuthModule { }
