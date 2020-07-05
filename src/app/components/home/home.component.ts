import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Subscription, interval } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import CryptoJS from 'crypto-js';
import jsQR from 'jsqr';

import { environment } from '../../../environments/environment';
import { ToastController, LoadingController } from '@ionic/angular';

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
  
  showQR: Boolean = false;
  scanActive: Boolean = false;
  videoElement: any;
  canvasElement: any;
  canvasContext: any;

  @ViewChild('video', { static: false }) video: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  
  loading: HTMLIonLoadingElement;

  constructor(private user$: UserService, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {}

  ngAfterViewInit(): void {
    this.videoElement = this.video.nativeElement;
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvas.nativeElement.getContext('2d');
  }
  ngOnInit() {
    this.user$.afAuth.onAuthStateChanged(auth => {
      if (auth) {
        this.user$.user.subscribe(user => {
            if (user.admin) {
              this.showQR = false;
            }
            else {
              this.showQR = true;
              this.autogenCode(user.id);
              this.subscription = this.timer.subscribe(() => this.setTimerValue(user.id));
            }
          })
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

  async startScan() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'enviroment'} });
    this.videoElement.srcObject = stream;
    this.videoElement.setAttribute('playsinline', true);
    this.videoElement.play();

    this.loading = await this.loadingCtrl.create({});
    await this.loading.present();
    requestAnimationFrame(this.scan.bind(this));
  }

  async scan() {
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
      if (this.loading) {
        await this.loading.dismiss();
        this.loading = null;
        this.scanActive = true;
      }

      this.canvasElement.height = this.videoElement.videoHeight;
      this.canvasElement.width = this.videoElement.videoWidth;

      this.canvasContext.drawImage(this.videoElement, 0, 0, this.canvasElement.height, this.canvasElement.width);

      const imageData = this.canvasContext.getImageData(0, 0, this.canvasElement.height, this.canvasElement.width);

      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'attemptBoth'
      })
      console.log(code);

      if (code) {
        this.showConfirm(`Token_ ${CryptoJS.AES.decrypt(code.data, environment.secret_key).toString(CryptoJS.enc.Utf8)}`);
        this.scanActive = false;
      }
      else if (this.scanActive) requestAnimationFrame(this.scan.bind(this));

    } else {
      requestAnimationFrame(this.scan.bind(this));
    }
  }

  action() {
    this.scanActive = !this.scanActive;
    
    if (this.scanActive) this.startScan();
  }

  async showConfirm(decrypt) {
    const toast = await this.toastCtrl.create({
      message: decrypt
    })

    toast.present();
  }

}
