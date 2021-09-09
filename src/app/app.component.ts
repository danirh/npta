import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private socketService: SocketService, private router: Router) { }

  ngOnInit() {
    var arr = document.cookie.split(";");
    var URIEncodedUsername = arr.find(i=>i.includes("username="))?.trim().substr(9);
    if(URIEncodedUsername) this.socketService.setUser(decodeURIComponent(URIEncodedUsername));
    else this.router.navigateByUrl("/");
  }
}
