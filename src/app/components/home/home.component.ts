import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Subscription, interval } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { AngularFireFunctions } from '@angular/fire/functions';

import { environment } from '../../../environments/environment';
import jsQR from 'jsqr';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

  countdown = 0;
  progress = 0;
  coded: String;
  subscription : Subscription;
  timer: Observable<number>;
  
  showQR: Boolean;
  scanActive: Boolean;
  videoElement: any;
  canvasElement: any;
  canvasContext: any;

  @ViewChild('video', { static: false }) video: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  
  loading: HTMLIonLoadingElement;

  constructor(private user$: UserService, private token$: TokenService, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
    this.coded = '';
    this.showQR = false;
    this.scanActive = false;
    this.timer = interval(100);
  }

  ngOnInit() {
    this.user$.afAuth.onAuthStateChanged(auth => {
      if (auth) {
        this.user$.user.subscribe(async user => {
            if (!user.admin) {
              await this.showLoad();

              this.token$.fetchToken().then(async response => {
                await this.stopLoad();
                
                if (response.ok) {
                  this.showQR = true;
                  this.coded = response.jwt;
                  this.subscription = this.timer.subscribe(() => this.setTimerValue());
                }
              });
            }
          })
      }
    });
  }

  ngAfterViewInit(): void {
    this.videoElement = this.video.nativeElement;
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvas.nativeElement.getContext('2d');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  fetchToken() {
    this.token$.fetchToken().then(async response => {
      await this.stopLoad();
      
      if (response.ok) this.coded = response.jwt;
    });
  }

  async setTimerValue() {
    this.countdown = ++this.countdown > 600 ? 0 : this.countdown;
    this.progress = (this.countdown / 600);

    if (this.countdown == 0) {
      await this.showLoad();
      
      this.fetchToken();
    }
  }

  async showLoad() {
    this.loading = await this.loadingCtrl.create({});
    await this.loading.present();
  }

  async stopLoad() {
    await this.loading.dismiss();
    this.loading = null;
  }

  async startScan() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'enviroment'} });
    this.videoElement.srcObject = stream;
    this.videoElement.setAttribute('playsinline', true);
    this.videoElement.play();

    await this.showLoad();
    requestAnimationFrame(this.scan.bind(this));
  }

  async scan() {
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
      if (this.loading) {
        await this.stopLoad();
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
        this.showConfirm(`Token_ ${code}`);
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
