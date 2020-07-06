import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private buildToken: (data: any) => Observable<any>;
  private confirmToken: (data: any) => Observable<any>;

  constructor(private fns: AngularFireFunctions) {
    // Set callable function
    this.buildToken = this.fns.httpsCallable('createToken');
    this.confirmToken = this.fns.httpsCallable('validateToken');
  }

  /** Call 'createToken' function from Firebase */
  async fetchToken(): Promise<any> {
    return await this.buildToken(null).toPromise();
  }

  /** Call 'validateToken' frunction from Firebase */
  async allowAccess(token: string): Promise<any> {
    return await this.confirmToken({ token: token }).toPromise();
  }
}
