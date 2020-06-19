import { Component, ViewChild } from '@angular/core';
import { IonTabs, ModalController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AccountComponent } from '../components/account/account.component';

@Component({
  selector: 'app-home',
  templateUrl: 'dash.page.html',
  styleUrls: ['dash.page.scss'],
})
export class Dashboard {

  @ViewChild('menuTabs') tabs: IonTabs;

  title: string = 'home';
  options: String = 'add-circle-outline'
  items: Array<{ path: string, title: string, icon: string}> = [
    { path: 'home', title: 'Home', icon: 'home-sharp' },
    { path: 'record', title: 'Record', icon: 'server' },
    // { path: 'account', title: 'Account', icon: 'person-circle' },
  ];

  constructor(private afAuth: AngularFireAuth, public modalController: ModalController) { }

  tabChanged() {
    this.title = this.tabs.getSelected();
    switch (this.title) {
      case 'home':
        this.options = 'add-circle-outline';
        break;
      case 'record':
        this.options = 'filter-outline';
        break;
      // case 'account':
      //   this.options = 'settings-outline';
      // break;
      default:
        this.options = 'ellipsis-vertical'
        break;
    }
  }

  async openAccount() {
    const modal = await this.modalController.create({
      component: AccountComponent
    });

    return await modal.present();
  }

}
