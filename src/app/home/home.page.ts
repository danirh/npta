import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  room;
  user;
  sectionHeight = "50%";
  orientation: string;
  orientationSubject = new Subject();
  screenHeightSubject = new Subject();
  resizeTimerId: any;
  constructor(private route: ActivatedRoute, private socketService: SocketService) { }

  @HostListener('window:resize')
  onResize() {
    let count = 20;
    clearInterval(this.resizeTimerId);
    this.resizeTimerId = setInterval(()=>{
      if(document.activeElement !== document.body || !count--) clearInterval(this.resizeTimerId);
      this.screenHeightSubject.next(window.screen.availHeight)

    },100)
  }

  ngOnInit() {
    this.screenHeightSubject.pipe(distinctUntilChanged()).subscribe(a=>{
      clearInterval(this.resizeTimerId);
      this.genSectionHeight()
    })
    
    this.screenHeightSubject.next(window.screen.availHeight);

    window.screen.orientation.addEventListener("change",()=>{
      (document.activeElement as HTMLElement).blur();
    })

    this.room = this.route.snapshot.paramMap.get("room");
    this.socketService.setRoom(this.room);
    this.user = this.socketService.username;
    this.socketService.connect();

  }

  onLogout() {
    this.socketService.logout();
  }

  genSectionHeight() {
    let isLandscape = window.screen.orientation.type.includes("landscape");
    if(isLandscape) this.sectionHeight = (window.innerHeight - 56) + 'px';
    else this.sectionHeight = (window.innerHeight - 56) / 2 + 'px';
    this.orientation = isLandscape ? "landscape" : "portrait";
  }

  onRefresh() {
    location.reload();
  }
}
