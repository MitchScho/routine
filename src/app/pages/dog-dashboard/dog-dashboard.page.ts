import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DogService } from 'src/app/services/dog.service';

@Component({
  selector: 'app-dog-dashboard',
  templateUrl: './dog-dashboard.page.html',
  styleUrls: ['./dog-dashboard.page.scss'],
})
export class DogDashboardPage implements OnInit {
  dogList = [];
  constructor(
    private navCtrl: NavController,
    private dogService: DogService,
  ) { }

  ngOnInit() {

    this.dogService.getAllDogs().subscribe((res) => {
      this.dogList = res;
    });
  }

  addDog() {
    this.navCtrl.navigateForward('add-dog');
  }
}
