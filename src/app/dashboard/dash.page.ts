import { Component, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'dash.page.html',
  styleUrls: ['dash.page.scss'],
})
export class Dashboard {

  @ViewChild('menuTabs') tabs: IonTabs;

  title: String = 'Home';
  items: Array<{ path: string, title: string, icon: string}> = [
    { path: 'home', title: 'Home', icon: 'home-sharp' },
    { path: 'record', title: 'Record', icon: 'server' },
    { path: 'account', title: 'Account', icon: 'person-circle' },
  ];

  constructor() {}

  tabChanged() {
    this.title = this.tabs.getSelected();
  }

}
