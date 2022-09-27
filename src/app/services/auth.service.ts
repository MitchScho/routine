//--------------- Core -------------------------------------//
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, throwError, pipe } from 'rxjs';
import { filter, map } from 'rxjs/operators';
//---------------FIREBASE----------------------------------//
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
//----------------- Helpers ----------------------------------//
import { UiHelper } from '../helpers/ui.helper';
//---------------- Data Models --------------------------------//
import { AuthDb } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public uiHelper: UiHelper,
    public http: HttpClient,
    public fireStoreAuth: AngularFireAuth
  ) {}

  //------ Listen To Auth  -------------//
  listenToAuthChanges() {
    return this.fireStoreAuth.authState;
  }

  //-------Create User With Email And Password------------------------------------------//
  createUserWithEmailAndPassword(email: string, password: string) {
    this.uiHelper.showLoader('Loading...');

    return from(
      this.fireStoreAuth
        .createUserWithEmailAndPassword(email, password)
        .then((res) => {
          this.uiHelper.hideLoader();
          return res;
        })
        .catch((error) => {
          this.uiHelper.displayErrorAlert(error.message);
          this.uiHelper.hideLoader();
          return undefined;
        })
    ).pipe(
      filter((res) => {
        if (res !== 'undefined' && res !== undefined) return res;
      })
    );
  }

  //-------Sign Up ---------------------------------------------------------------------//
  signup(email, password) {
    return from(
      this.fireStoreAuth.createUserWithEmailAndPassword(email, password)
    );
  }

  //-------Verify Email--------------------------------------------//
  verifyEmail(oodCode) {
    return from(this.fireStoreAuth.applyActionCode(oodCode));
  }

  //------ Change Password -----------------------------------------------------//
  changePassword(oobCode, password) {
    return from(this.fireStoreAuth.confirmPasswordReset(oobCode, password));
  }

  //-------Forgot Password------------------------------------//
  // forgotPassword(email) {
  //   return from(firebase.auth().sendPasswordResetEmail(email));
  // }

  //-------Send Email Verification------------------------------------------//
  sendEmailVerification() {
    return from(
      this.fireStoreAuth.currentUser.then((user) =>
        user.sendEmailVerification()
      )
    );
  }

  //-------Login In--------------------------------------------------------------------------------//
  login(email, password) {
    this.uiHelper.showLoader('Loading...');

    return from(
      this.fireStoreAuth
        .signInWithEmailAndPassword(email, password)
        .then((res) => {
          this.uiHelper.hideLoader();
          return res;
        })
        .catch((error) => {
          this.uiHelper.displayErrorAlert(error.message);
          this.uiHelper.hideLoader();
          return undefined;
        })
    ).pipe(
      filter((res) => {
        if (res !== "undefined" && res !== undefined)
          return res;
      }),
      map((res) => {
        const user: AuthDb = { ...res.user.toJSON() };
        return user
      })
    )
  }

  //-------Log Out--------------------------------//
  logout() {
    return from(this.fireStoreAuth.signOut());
  }
}
