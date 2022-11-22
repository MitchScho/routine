import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ActivityActions } from 'src/app/actions/activity.action';
import { ActivityDb, initialActivityDb } from 'src/app/models/activity.model';
import { ActivityService } from 'src/app/services/activity.service';
import { ActivityState } from 'src/app/state/activity.state';

@Component({
  selector: 'app-activity-dashboard',
  templateUrl: './activity-dashboard.page.html',
  styleUrls: ['./activity-dashboard.page.scss'],
})
export class ActivityDashboardPage implements OnInit {
  activityList = [];
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private navCtrl: NavController,
    private activityService: ActivityService,
    private activityState: ActivityState,
    private activityActions: ActivityActions
  ) {}

  ngOnInit() {
    this.activityActions.getAllActivities().pipe(take(1)).subscribe();
    this.activityState
      .getActivityList$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((activityList) => {
        this.activityList = [...activityList];
        console.log('activityList', activityList);
      });
  }

  addActivity() {
    this.navCtrl.navigateForward('add-activity');
  }

  

  goToActivityDetailPage(activity) {
    // console.log("activity", activity);
    this.activityState.setActivity(activity);
    this.navCtrl.navigateForward('update-activity');
  }

  /**
   * @method ngOnDestroy
   * @description Angular page life cycle method that runs when page is being destroyed
   *                            - Generally used to clean up any subscribed streams/observables to prevent data leaks
   * @return void
   */
  ngOnDestroy(): void {
    // console.log('Destroyed Create Feature Page');
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
