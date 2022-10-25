import { Component, OnInit } from '@angular/core';
import { ActivityDb, initialActivityDb } from 'src/app/models/activity.model';
import { ActivityState } from 'src/app/state/activity.state';
import {
  AngularFireUploadTask,
  AngularFireStorage,
} from '@angular/fire/compat/storage';
import { FirebaseHelper } from 'src/app/helpers/firebase.helper';
import { finalize, map } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { UiHelper } from 'src/app/helpers/ui.helper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivityActions } from 'src/app/actions/activity.action';

@Component({
  selector: 'app-update-activity',
  templateUrl: './update-activity.page.html',
  styleUrls: ['./update-activity.page.scss'],
})
export class UpdateActivityPage implements OnInit {
  activity: ActivityDb = { ...initialActivityDb };
  formObj: FormGroup;
  // task: AngularFireUploadTask;
  photoUrl: string = null;

  constructor(
    private activityState: ActivityState,
    private fb: FormBuilder,
    private activityActions: ActivityActions,
    private navCtrl: NavController,
    private uiHelper: UiHelper,
    private storage: AngularFireStorage,
    private firebaseHelper: FirebaseHelper
  ) {}

  ngOnInit() {
    console.log('activity', this.activity);
    this.activityState.getActivityItemObs().subscribe((activityItem) => {
      this.activity = { ...activityItem };
    });
    this.photoUrl = this.activity?.photoUrl;
    console.log('activity', this.activity);
    this.initForm();
  }

  initForm() {
    this.formObj = this.fb.group({
      name: [this.activity?.name, [Validators.required]],
    });
  }

  updateActivity() {
    const activity = {
      ...this.activity,
      name: this.formObj.value.name,
      photoUrl: this.photoUrl,
    };
    this.activityActions.updateActivity(activity).subscribe((res) => {
      console.log('activity res', res);
      this.navCtrl.pop();
    });
  }

  goBack() {
    this.navCtrl.back();
  }

  uploadFiles(event: any) {
    console.log('event---', event);
    const media: FileList = event.files;
    console.log('media---', media);
    const fileToUpload = media[0];
    const storageId = this.firebaseHelper.generateFirebaseId();
    const storagePath = 'avatar/' + storageId + '.png';
    if (fileToUpload.type.indexOf('image') > -1) {
      try {
        this.uiHelper.showLoader('Loading......');
        const ref = this.storage.ref(storagePath);
        this.storage
          .upload(storagePath, fileToUpload)
          .snapshotChanges()
          .pipe(
            map((res) => {
              console.log('map response', res);
            }),
            finalize(async () => {
              console.log('finished');
              ref.getDownloadURL().subscribe((res) => {
                console.log('finalize response', res);
                this.photoUrl = res;
                this.uiHelper.hideLoader();
              });
            })
          )
          .subscribe((res) => {});
      } catch (error) {
        this.uiHelper.hideLoader();
        this.uiHelper.displayErrorAlert(error);
      }
    } else {
      this.uiHelper.displayErrorAlert('Incorrect File Type....');
    }
  }
}
