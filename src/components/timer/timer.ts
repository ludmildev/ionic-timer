import { Component, Input } from '@angular/core';
import { ITimer } from '../../interfaces/itimer';

@Component({
  selector: 'timer',
  templateUrl: 'timer.html'
})
export class TimerComponent {

  @Input() timeInSeconds: number;
  @Input() restTimeSeconds: number;
  @Input() series: number = 1;

  private pastSeries: number = 1;
  private inRestMode: boolean = false;

  public timer: ITimer;

  constructor() {
  }

  ngOnInit() {
      this.initTimer();
  }

  hasFinished() {
      return this.timer.hasFinished;
  }

  initTimer(seconds?, pastSeries?) {
      if(!this.timeInSeconds) { this.timeInSeconds = 0; }
      if(!this.restTimeSeconds) { this.restTimeSeconds = 0; }
      if(!this.series) { this.series = 1; }

      this.timer = <ITimer>{
          seconds: (seconds ? seconds : this.timeInSeconds),
          runTimer: false,
          hasStarted: false,
          hasFinished: false,
          secondsRemaining: (seconds ? seconds : this.timeInSeconds),
          pastSeries: (pastSeries ? pastSeries : 0)
      };

      this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
  }

  startTimer() {
      this.timer.hasStarted = true;
      this.timer.runTimer = true;
      this.timerTick();
  }

  pauseTimer() {
      this.timer.runTimer = false;
  }

  resumeTimer() {
      this.startTimer();
  }

  timerTick() 
  {
      setTimeout(() => 
      {
          if (!this.timer.runTimer) { return; }
          this.timer.secondsRemaining--;
          this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
          if (this.timer.secondsRemaining > 0) {
              this.timerTick();
          }
          else 
          {
              if (this.restTimeSeconds > 0 && !this.inRestMode) 
              {
                this.timer.pastSeries++;
                this.inRestMode = true;

                setTimeout(() => {
                  this.initTimer(this.restTimeSeconds, this.timer.pastSeries);
                  this.startTimer();

                  //make sound for rest mode
                }, 1000);
              }
              else if (this.inRestMode && this.series > this.pastSeries)
              {
                this.pastSeries++;
                this.inRestMode = false;

                setTimeout(() => {
                  this.initTimer(this.timeInSeconds, this.timer.pastSeries);
                  this.startTimer();

                  //make sound for next serie
                }, 1000);
              }
              else
              {
                this.timer.hasFinished = true;
                this.pastSeries = 1;
                this.inRestMode = false;

                //make sound for timer finished
              }
          }
      }, 1000);
  }

  getSecondsAsDigitalClock(inputSeconds: number) {
      var sec_num = parseInt(inputSeconds.toString(), 10); // don't forget the second param
      var hours   = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      var seconds = sec_num - (hours * 3600) - (minutes * 60);
      var hoursString = '';
      var minutesString = '';
      var secondsString = '';
      hoursString = (hours < 10) ? "0" + hours : hours.toString();
      minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
      secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
      return hoursString + ':' + minutesString + ':' + secondsString;
  }

}
