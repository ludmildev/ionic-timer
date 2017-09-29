import { TimerComponent } from './../../components/timer/timer';
import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild(TimerComponent) timer: TimerComponent;

  public seconds = 60;
  public rest = 2;
  public series = 4;

  constructor(public navCtrl: NavController) {

  }

}
