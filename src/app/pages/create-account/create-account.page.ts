import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { UiHelper } from 'src/app/helpers/ui.helper';
import { AuthService } from 'src/app/services/auth.service';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage implements OnInit {
  formObj: FormGroup;
  example: String = 'String example';
  flag = false;
  emailValidationPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
    console.log('example', this.example);
    this.formObj = this.fb.group({
      name: ['', [Validators.required]],
      email: [
        '',
        [Validators.compose([Validators.required, Validators.minLength(1), Validators.pattern(this.emailValidationPattern)])],
      ],
      password: [
        '',
        [
          Validators.compose([
            Validators.maxLength(20),
            Validators.minLength(8),
            Validators.required,
          ]),
        ],
      ],
      passwordConfirm: ['', []],
      agreedToTerms: [false, [Validators.compose([Validators.requiredTrue])]],
    });
  }

  goBack() {
    this.navCtrl.navigateBack('/login');
  }

  createAccount() {
    const formValue = this.formObj.value;
    this.authService
      .createUserWithEmailAndPassword(formValue.email, formValue.password)
      .subscribe((res) => {
        console.log('response', res);
        this.uiHelper.displayToast(
          'User Successfully Created Account',
          2000,
          'top'
        );
        // this.goBack()
      });

    console.log(formValue);
    console.log(this.formObj);
  }

  openTerms() {}

  onShow() {
    console.log('flag variable', this.flag);
    this.flag = !this.flag;
  }
}
