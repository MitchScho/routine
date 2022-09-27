//--------------- Core ----------------------------------------------------------------//
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class UiHelper {
  isLoading = false;
  loader: HTMLIonLoadingElement;
  mainLoader: any;

  constructor(
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) { }


  public async showLoader(displayMessage: string) {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      message: displayMessage,
      // duration: 9000,   //this shouldn't be here if handling hide loader correctly***
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss().catch(() => { return; });
        }
      });
    });
  }

  public async hideLoader() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss().catch(() => { return; });
  }

  public async displayErrorAlert(displayMessage: any) {
    await this.alertCtrl.create({
      header: 'An error occured!',
      message: displayMessage,
      buttons: ['OK']
    }).then(alertEl => {
      alertEl.present();
    });
  }

  public async displayMessageAlert(title: string, displayMessage: string) {
    await this.alertCtrl.create({
      header: title,
      message: displayMessage,
      mode: 'ios',
      buttons: ['OK']
    }).then(alertEl => {
      alertEl.present();
    });
  }

  public async displayMessageAlertForAppUpdate(title: string, displayMessage: string, hyperlink: string) {
    await this.alertCtrl.create({
      header: title,
      message: displayMessage,
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
      }, {
        text: 'Continue',
        role: 'submit',
        handler: () => {
          window.open(hyperlink);
        }
      }]
    }).then(alertEl => {
      alertEl.present();
    });
  }

  public async createConfirmAlert(title: string, displayMessage: string) {
    this.alertCtrl.create({
      header: title,
      message: displayMessage,
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
      }, {
        text: 'Confirm',
        handler: () => {
          return { confirm: true };
        }
      }]
    });
  }

  public displayToast(message: string, duration: number, position: "top" | "bottom" | "middle") {
    this.toastCtrl.create({
      message,
      duration,
      position,
      buttons: [{
        text: 'Close',
        role: 'cancel',
      }],
    }).then(toastEl => {
      toastEl.present();
    });
  }
}
