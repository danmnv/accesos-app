import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { TokenService } from 'src/app/services/token.service';
import { Subscription, interval } from 'rxjs';
import { Observable } from 'rxjs';

import jsQR from 'jsqr';

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

  constructor(private user$: UserService, private token$: TokenService, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {}

  ngOnInit() {
    // Defaults
    this.coded = '';
    this.showQR = false;
    this.scanActive = false;
    this.timer = interval(100);

    // Get authentication
    this.user$.afAuth.onAuthStateChanged(auth => {
      // If exist 
      if (auth) {
        // Fetch user doc
        this.user$.user.subscribe(async user => {
            // If user is student
            if (!user.admin) {
              await this.showLoad();

              // Fetch token from server
              this.token$.fetchToken().then(async response => {
                await this.stopLoad();
                
                // Success
                if (response.ok) {
                  this.showQR = true;
                  this.coded = response.jwt;

                  // Timer to fetch token every minute
                  this.subscription = this.timer.subscribe(() => this.setTimerValue());
                }
              });
            }
          })
      }
    });
  }

  ngAfterViewInit(): void {
    // Set html elements
    this.videoElement = this.video.nativeElement;
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvas.nativeElement.getContext('2d');
  }

  ngOnDestroy() {
    // Delete timer
    console.log("destroy")
    this.subscription.unsubscribe();
  }

  /** Call fetchToken from TokenService */
  fetchToken() {
    this.token$.fetchToken().then(async response => {
      await this.stopLoad();
      
      // Success
      if (response.ok) this.coded = response.jwt;
    });
  }

  /** Timer to increment bar progress and fetch token every minute */
  async setTimerValue() {
    this.countdown = ++this.countdown > 600 ? 0 : this.countdown;
    this.progress = (this.countdown / 600);

    // Fetch token when timer is zero
    if (this.countdown == 0) {
      await this.showLoad();
      
      this.fetchToken();
    }
  }

  /** Show loading object */
  async showLoad() {
    this.loading = await this.loadingCtrl.create({});
    await this.loading.present();
  }

  /** Stop loading object */
  async stopLoad() {
    await this.loading.dismiss();
    this.loading = null;
  }

  /** Toggle scanActive */
  action() {
    this.scanActive = !this.scanActive;
    
    if (this.scanActive) this.startScan();
  }

  /** Open video element (device camera) */
  async startScan() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'enviroment'} });
    this.videoElement.srcObject = stream;
    this.videoElement.setAttribute('playsinline', true);
    this.videoElement.play();

    await this.showLoad();
    requestAnimationFrame(this.scan.bind(this));
  }

  /** Scan QR code */
  async scan() {
    // Video element is ready
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
      // Stop loading
      if (this.loading) {
        await this.stopLoad();
        this.scanActive = true;
      }

      this.canvasElement.height = this.videoElement.videoHeight;
      this.canvasElement.width = this.videoElement.videoWidth;

      this.canvasContext.drawImage(this.videoElement, 0, 0, this.canvasElement.height, this.canvasElement.width);

      // Get image data
      const imageData = this.canvasContext.getImageData(0, 0, this.canvasElement.height, this.canvasElement.width);

      // Read QR code
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      // If code was decrypted
      if (code) {
        this.showConfirm();
        this.scanActive = false;
      }
      else if (this.scanActive) requestAnimationFrame(this.scan.bind(this));

    } else {
      requestAnimationFrame(this.scan.bind(this));
    }
  }

  /** Show toast sucess */
  async showConfirm(msg = "Success") {
    const toast = await this.toastCtrl.create({
      message: msg
    })

    toast.present();
  }

}
