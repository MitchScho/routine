import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivityService } from 'src/app/services/activity.service';

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
  ) { }

  ngOnInit() {

    this.activityService.getAllActivities().subscribe((res) => {
      this.activityList = res;
    });
  }

  addActivity() {
    this.navCtrl.navigateForward('add-activity');
  }
}
