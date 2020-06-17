import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'dash.page.html',
  styleUrls: ['dash.page.scss'],
})
export class Dashboard {

  tabs: Array<{ name: string, route: string, icon: string}> = [
    { name: 'home', route: 'Home', icon: 'home' },
    { name: 'record', route: 'Record', icon: 'server' },
    { name: 'account', route: 'Account', icon: 'person-circle' },
  ];

  constructor() {}

}
