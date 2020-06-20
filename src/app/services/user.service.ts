import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';

interface User {
  email: String,
  username: String,
  name: String,
  ap_pat: String,
  ap_mat?: String,
}

@Injectable({
  providedIn: 'root'
})
class UserService {

  private itemDoc: AngularFirestoreDocument<User>;
  user: Observable<User>;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private storage: Storage) {
    // Get user
    this.afAuth.onAuthStateChanged(user => {
      if (user) this.setUser(user.uid);
    });
  }

  // Set document user
  setUser(uid: String) {
    this.itemDoc = this.afs.doc<User>(`users/${uid}`);
    this.user = this.itemDoc.valueChanges();
    this.user.subscribe(user => this.storage.set('user', { docid: uid, ...user }));
  }

  getLocalUser(): Promise<any> {
    return this.storage.get('user');
  }
}

export { User, UserService };
