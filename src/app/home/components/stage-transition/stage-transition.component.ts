import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations'
import { timer } from 'rxjs';

@Component({
  selector: 'app-stage-transition',
  templateUrl: './stage-transition.component.html',
  styleUrls: ['./stage-transition.component.scss'],
  animations: [
    trigger('counterValue', [
      transition(':enter, :increment, :decrement', [
        style({ transform: 'scale(0.2)' }),
        animate('600ms', style({ transform: '*' })),
      ]),
    ]),
  ]
})
export class StageTransitionComponent implements OnInit {
  counterArray = [{
    text: "3",
    styles: {
      'color': "red",
      'font-size': "128px"
    }
  },
  {
    text: "2",
    styles: {
      'color': "orange",
      'font-size': "128px"
    }
  },
  {
    text: "1",
    styles: {
      'color': "green",
      'font-size': "128px"
    }
  },
  {
    text: "READY!!",
    styles: {
      'color': "blue",
      'font-size': "64px"
    }
  }];
  counter: number = 0;
  constructor() { }

  ngOnInit() {
    let timerSubscription = timer(0,1000).subscribe((t)=>{
      if(t>3) timerSubscription.unsubscribe();
      else this.counter = t;
    })
  }

}
