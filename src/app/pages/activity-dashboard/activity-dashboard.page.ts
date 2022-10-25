import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivityActions } from 'src/app/actions/activity.action';
import { ActivityService } from 'src/app/services/activity.service';
import { ActivityState } from 'src/app/state/activity.state';

@Component({
  selector: 'app-activity-dashboard',
  templateUrl: './activity-dashboard.page.html',
  styleUrls: ['./activity-dashboard.page.scss'],
})
export class ActivityDashboardPage implements OnInit {

  activityList = [];

  constructor(
    private navCtrl: NavController,
    private activityService: ActivityService,
    private activityState: ActivityState,
    private activityActions: ActivityActions,
  ) { }

  ngOnInit() {

    this.activityActions.getAllActivities().subscribe();
    this.activityState.getActivityListObs().subscribe((activityList) => {
      this.activityList = [...activityList];
      console.log("activityList", activityList);
    });
  }

  addActivity() {
    this.navCtrl.navigateForward('add-activity');
  }

  goToActivityDetailPage(activity) {
    // console.log("activity", activity);
    this.activityState.setActivityItem(activity)
    this.navCtrl.navigateForward('update-activity');
  };

}
