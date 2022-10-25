import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { UiHelper } from 'src/app/helpers/ui.helper';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  formObj: FormGroup;

  constructor(
    private navCtrl: NavController,
    private fb: FormBuilder,
    private authService: AuthService,
    private uiHelper: UiHelper
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.formObj = this.fb.group({
      password: ['', [Validators.required]],
      email: [
        '',
        [Validators.compose([Validators.required, Validators.minLength(1)])],
      ],
    });
  }

  goToCreateAccountPage() {
    this.navCtrl.navigateForward("create-account")
  }

  login() {

    this.authService.login(this.formObj.value.email, this.formObj.value.password).subscribe(res => {
      console.log("login res", res);
      const user = res
      console.log("login user", user);
      this.navCtrl.navigateForward('activity-dashboard');
  })
}

}
