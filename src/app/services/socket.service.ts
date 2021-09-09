import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public username;
  public room;
  public isHost: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private socket: Socket;
  public recievedMessages: Subject<any> = new Subject();
  public roomData: Subject<any> = new Subject();

  constructor(private router: Router) { }
  setUser(name) {
    this.username = name
  }
  setRoom(name) {
    this.room = name
  }
  connect() {
    this.socket = io(environment.backend_host);

    this.socket.emit("join", { username: this.username, room: this.room }, (error, isHost) => {
      if (error) {
        alert(error)
        location.href = '/'
      }
      this.isHost.next(isHost);
    })
    
    this.socket.on('message',(data)=>{
      this.recievedMessages.next(data)
    })

    this.socket.on('roomData',(data)=>{
      this.roomData.next(data)
    })
  }

  sendMessage(data) {
    this.socket.emit('sendMessage',data,()=>{})
  }

  getSocket() {
    return this.socket;
  }
  logout() {
    this.socket.disconnect();
    location.href = "/";
  }
}
