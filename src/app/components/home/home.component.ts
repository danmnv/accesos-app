import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Subscription, interval } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import CryptoJS from 'crypto-js';

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
  key: String = "t2vjd@rjsOMX&pR@4WNzh#Bo9wgehFmT^8YS3@^b";

  constructor(private user$: UserService) {
    this.autogenCode();
    this.subscription = this.timer.subscribe(() => this.setTimerValue());
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setTimerValue() {
    this.countdown = ++this.countdown > 150 ? 0 : this.countdown;
    this.progress = (this.countdown / 150);

    if (this.countdown == 0) this.autogenCode();
  }

  autogenCode() {
    this.coded = CryptoJS.AES.encrypt("hola", this.key).toString();
  }

}
