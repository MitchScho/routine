import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { UiHelper } from 'src/app/helpers/ui.helper';
import { DogService } from 'src/app/services/dog.service';
import {AngularFireUploadTask, AngularFireStorage,} from '@angular/fire/compat/storage';
import { FirebaseHelper } from 'src/app/helpers/firebase.helper';
import { finalize, map } from 'rxjs/operators';

@Component({
  selector: 'app-add-dog',
  templateUrl: './add-dog.page.html',
  styleUrls: ['./add-dog.page.scss'],
})
export class AddDogPage implements OnInit {
  formObj: FormGroup;
  task: AngularFireUploadTask;
  photoUrl: String = null;

  constructor(
    private fb: FormBuilder,
    private dogService: DogService,
    private navCtrl: NavController,
    private uiHelper: UiHelper,
    private storage: AngularFireStorage,
    private firebaseHelper: FirebaseHelper,
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.formObj = this.fb.group({
      name: ['', [Validators.required]],
      photoUrl: ['', [Validators.compose([Validators.required])]],
    });
  }

  addDog() {
    const dog = {
      name: this.formObj.value.name,
      photoUrl: this.photoUrl
    };
    this.dogService.addDog(dog).subscribe((res) => {
      console.log('dog res', res);
      this.navCtrl.pop();
    });
  }

  goBack() {
    this.navCtrl.back();
  }

  uploadFiles(event: any) {
    console.log("event---", event);
    const media: FileList = event.files;
    console.log("media---", media);
    const fileToUpload = media[0];
    const storageId = this.firebaseHelper.generateFirebaseId();
    const storagePath = "avatar/" + storageId + ".png";
    if (fileToUpload.type.indexOf('image') > -1) {
      try {
        this.uiHelper.showLoader('Loading......')
        const ref = this.storage.ref(storagePath)
        this.storage.upload(storagePath, fileToUpload).snapshotChanges().pipe(
          map((res) => {
            console.log("map response", res);
          }),
          finalize(async () => {
            console.log("finished")
            ref.getDownloadURL().subscribe((res) => {
              console.log("finalize response", res);
              this.photoUrl = res;
              this.uiHelper.hideLoader();
            })
          })
        ).subscribe(res => {})
      }
      catch (error) {
        this.uiHelper.hideLoader()
        this.uiHelper.displayErrorAlert(error);
      }
    } else {
      this.uiHelper.displayErrorAlert('Incorrect File Type....');
    }
  }
}
