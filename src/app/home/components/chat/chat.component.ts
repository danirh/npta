import { Component, ElementRef, HostBinding, Input, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @Input() room: string;

  composedMessage: string;
  messages: Array<any> = [];
  users: Array<any> = [];
  messagesContainer: any;

  constructor(private socketService: SocketService, private hostEl: ElementRef) { }

  // @HostBinding('style.height') fixedHeight: string;

  ngOnInit() {
    // this.fixedHeight = window.innerHeight - 344 + 'px';
    this.messagesContainer = this.hostEl.nativeElement.querySelector("#messages")

    this.socketService.recievedMessages.subscribe((msg) => {
      this.messages.push(msg);
    })

    this.socketService.roomData.subscribe(data => {
      this.users = data.users.map(user=>{
        return {...user, isHost: data.host === user.username}
      })
    })
  }

  onSubmit() {
    this.socketService.sendMessage(this.composedMessage);
    this.composedMessage = "";
  }

  autoScroll() {
    // // New message element
    // const newMessage = this.messagesContainer.lastElementChild;
    // if(!newMessage) return;

    // // Height of the new message
    // const newMessageStyles = getComputedStyle(newMessage)
    // const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    // const newMessageHeight = newMessage.offsetHeight + newMessageMargin

    // // Visible height
    // const visibleHeight = this.messagesContainer.offsetHeight

    // // Height of messages container
    // const containerHeight = this.messagesContainer.scrollHeight

    // // How far have I scrolled?
    // const scrollOffset = this.messagesContainer.scrollTop + visibleHeight

    // if (containerHeight - newMessageHeight <= scrollOffset) {
    //     this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight
    // }

    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight
  }

}
