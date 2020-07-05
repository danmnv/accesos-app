import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private buildToken: (data: any) => Observable<any>;

  constructor(private fns: AngularFireFunctions) {
    // Set callable function
    this.buildToken = this.fns.httpsCallable('createToken');
  }

  async fetchToken(): Promise<any> {
    return await this.buildToken(null).toPromise();
  }
}
