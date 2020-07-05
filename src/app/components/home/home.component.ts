import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Subscription, interval } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import CryptoJS from 'crypto-js';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

  countdown = 0;
  progress = 0;
  coded: String = '';
  subscription : Subscription;
  timer: Observable<number> = interval(100);
  loadData: Promise<boolean>;
  
  showQR: Boolean = false;

  constructor(private user$: UserService) {}

  ngOnInit() {
    this.user$.afAuth.onAuthStateChanged(auth => {
      if (auth) {
        this.user$.user.subscribe(user => {
          // this.user$.getLocalUser().then(user => {
            console.log(user);
            if (user.admin) {
              this.showQR = false;
            }
            else {
              this.showQR = true;
              this.autogenCode(user.id);
              this.subscription = this.timer.subscribe(() => this.setTimerValue(user.id));
              this.loadData = Promise.resolve(true);
            }
          })
        // })
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setTimerValue(uid: string) {
    this.countdown = ++this.countdown > 150 ? 0 : this.countdown;
    this.progress = (this.countdown / 150);

    if (this.countdown == 0) this.autogenCode(uid);
  }

  autogenCode(uid: string) {
    this.coded = CryptoJS.AES.encrypt(uid, environment.secret_key).toString();
  }

}
