import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit, AfterViewInit {
  @Input('by') username: string;
  @Input('at') createdAt: string;
  @Input('content') message: string;
  @Output() afterViewInitEvent = new EventEmitter<void>()
  createdAtTime: string;

  constructor() { }

  ngOnInit() {
    let time = new Date(this.createdAt);
    this.createdAtTime = new Intl.DateTimeFormat("en-IN",{timeStyle: "short"} as any).format(time); 
  }

  ngAfterViewInit() {
    this.afterViewInitEvent.emit();
  }

}
