import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, Action, DocumentSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';

interface User {
  id: string,
  email: String,
  username: String,
  name: String,
  ap_pat: String,
  ap_mat?: String,
  admin: Boolean
}

@Injectable({
  providedIn: 'root'
})
class UserService {

  private itemDoc: AngularFirestoreDocument<User>;
  user: Observable<User>;

  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore, private storage: Storage) {
    // Get user
    this.afAuth.onAuthStateChanged(user => {
      if (user) this.setUser(user.uid);
    });
  }

  documentToObject = (ref: Action<DocumentSnapshot<User>>) => {
    const object = ref.payload.data();
    object.id = ref.payload.id;

    return object;
  }

  // Set document user
  setUser(uid: String) {
    this.itemDoc = this.afs.doc<User>(`users/${uid}`);
    this.user = this.itemDoc.snapshotChanges().pipe(map(reference => this.documentToObject(reference)));
    // this.user.subscribe(user => this.storage.set('user', { docid: uid, ...user }));
  }

  // async getLocalUser(): Promise<any> {
  //   return await this.storage.get('user');
  // }

  // async destroyLocalUser(): Promise<any> {
  //   return await this.storage.remove('user');
  // }
}

export { User, UserService };
