import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { temporaryDeclaration } from '@angular/compiler/src/compiler_util/expression_converter';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {

  constructor(public modalController: ModalController, public alertController: AlertController, private afAuth: AngularFireAuth, public user$: UserService, private router: Router) { }

  ngOnInit() {}

  // Delete session
  logOut() {
    this.afAuth.signOut().then(() => {
      this.dismissModal();
      this.router.navigate(['/auth/login']);
    });
  }

  // Alert to logout
  async alertConfirmation() {
    const alert = await this.alertController.create({
      header: 'Log out',
      message: 'Are you sure?',
      buttons: [
        { text: 'Cancel', role: 'cancel' }, 
        { text: 'Ok', handler: () => this.logOut() }
      ]
    });

    await alert.present();
  }

  // Close modal
  async dismissModal() {
    await this.modalController.dismiss();
  }
}
