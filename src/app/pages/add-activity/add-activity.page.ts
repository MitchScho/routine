import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { UiHelper } from 'src/app/helpers/ui.helper';
import { ActivityService } from 'src/app/services/activity.service';
import {AngularFireUploadTask, AngularFireStorage,} from '@angular/fire/compat/storage';
import { FirebaseHelper } from 'src/app/helpers/firebase.helper';
import { finalize, map, take } from 'rxjs/operators';
import { ActivityActions } from 'src/app/actions/activity.action';
import { ActivityDb } from 'src/app/models/activity.model';

@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.page.html',
  styleUrls: ['./add-activity.page.scss'],
})
export class AddActivityPage implements OnInit {
  formObj: FormGroup;
  task: AngularFireUploadTask;
  photoUrl = '';

  constructor(
    private fb: FormBuilder,
    private activityService: ActivityService,
    private navCtrl: NavController,
    private uiHelper: UiHelper,
    private storage: AngularFireStorage,
    private firebaseHelper: FirebaseHelper,
    private activityActions: ActivityActions,
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

  addActivity() {
    const activity: ActivityDb = {
      name: this.formObj.value.name,
      photoUrl: this.photoUrl
    };
    this.activityActions.createActivity(activity, 'activity-dashboard', 'back').pipe(take(1)).subscribe();
    
  
    // this.activityService.addActivity(activity).subscribe((res) => {
    //   console.log('activity res', res);
    //   this.navCtrl.pop();
    // });
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
