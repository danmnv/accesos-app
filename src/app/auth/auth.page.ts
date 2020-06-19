import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class Authenticate implements OnInit {

  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, private afAuth: AngularFireAuth, private router: Router, public toastController: ToastController) {
    this.formGroup = this.formBuilder.group({
      id: ['', Validators.required],
      passwd: ['', Validators.required]
    });
  }

  ngOnInit() {}

  async logIn() {
    let email: string = `al${this.formGroup.value.id}@edu.uaa.mx`;
    let password: string = this.formGroup.value.passwd;

    const toast = await this.toastController.create({ duration: 2500 });

    if (this.formGroup.valid) {
      await this.afAuth.signInWithEmailAndPassword(email, password)
        .then(
          user => {
            toast.message = `Welcome ${user.user.email}`;
            this.router.navigate(['']);
          },
          err =>toast.message = err.message
        )
        .finally(() => toast.present());
    }

  }

}