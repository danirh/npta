import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { PopoverController, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { WordPopupComponent } from '../home/components/word-popup/word-popup.component';
import { SocketService } from './socket.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private stage: BehaviorSubject<string> = new BehaviorSubject("start");
  private letter: string = "A";
  private inputMaps: any;
  private validWords: BehaviorSubject<any> = new BehaviorSubject({});
  private scores: any;
  private winners: any;
  private round: BehaviorSubject<string | number> = new BehaviorSubject(1);
  private timer: Subject<number> = new Subject();
  private viewOnly: Subject<boolean> = new Subject();
  public submissionTrigger: Subject<void> = new Subject();
  constructor(private socketService: SocketService, private toastController: ToastController, private http: HttpClient) { }

  getStage() {
    this.socketService.getSocket().emit('getStage',(round,scores,viewOnlyStatus)=>{
      this.round.next(round);
      this.scores = scores;
      this.viewOnly.next(viewOnlyStatus);
    })
    return this.stage as Observable<string>
  }

  getRound() {
    return this.round as Observable<string | number>
  }

  getTimer() {
    return this.timer as Observable<number>
  }

  getViewOnlyStatus() {
    return this.viewOnly as Observable<boolean>
  }

  startGame(rounds) {
    this.socketService.getSocket().emit('startGame',rounds);
  }

  handleGame() {
    this.socketService.getSocket().on('stageStart', () => {
      this.stage.next("start");
      this.scores = {total: []}
    });
    this.socketService.getSocket().on('stageRoundTransition', (round) => {
      this.round.next(round);
      this.viewOnly.next(false);
      this.validWords.next({});
      this.stage.next("transition");
    });
    this.socketService.getSocket().on('stageInput', ch => {
      this.letter = ch;
      this.stage.next("input");
    });
    this.socketService.getSocket().on('submitInput', () => {
      console.log("Submitting...")
      this.submissionTrigger.next();
    });
    this.socketService.getSocket().on('stageAssessment', inputMaps => {
      this.inputMaps = inputMaps;
      this.stage.next("assessment");
    });
    this.socketService.getSocket().on('stageScore', scoreMap => {
      this.scores = scoreMap;
      this.stage.next("score");
    });
    this.socketService.getSocket().on('stageResult', winners => {
      this.winners = winners;
      this.stage.next("result");
    });
    this.socketService.getSocket().on('timer', time => {
      this.timer.next(time);
    });
    this.socketService.getSocket().on('validWords', words => {
      this.validWords.next(words.reduce((acc,current)=>{ acc[current] = true; return acc},{}));
    });
  }

  getLetter() {
    return this.letter
  }

  getInputs() {
    return this.inputMaps
  }

  getValidWords() {
    return this.validWords.asObservable();
  }

  getScores() {
    return this.scores
  }

  getWinners() {
    return this.winners;
  }

  saveInput(input, isManual?) {
    let cb = isManual ? this.submissionToast : ()=>{};
    for (let category in input) input[category] = input[category].toLowerCase();
    this.socketService.getSocket().emit('saveInput',input,cb)
  }

  updateVote(word,isVoted) {
    this.socketService.getSocket().emit('updateVote',word,isVoted)
  }

  newGame() {
    this.socketService.getSocket().emit('newGame');
  }

  shareGame() {
    let url = location.origin + "/join.html?room=" + encodeURIComponent(this.socketService.room);
    window.open("whatsapp://send?text=" + encodeURI("Hey, join my room at\n\n" + url))    
  }

  checkIfHost() {
    return this.socketService.isHost.asObservable();
  }

  fetchValidWords() {
    this.socketService.getSocket().emit('fetchValidWords');
  }

  submissionToast = async (time) => {
      const toast = await this.toastController.create({
        header: 'Answer successfully locked',
        message: `Locked at ${time} sec`,
        duration: 2000,
        cssClass: 'custom-toast-position',
        translucent: true,
        mode: 'md',
        color: 'primary'
      });
      toast.present();
  }

  suggestWord(wordWithCategory,action) {
    this.http.post((environment.backend_host || '') + "/suggestWord",{wordWithCategory,action},{observe: 'response', responseType: 'text'}).subscribe(res=>{
      if(res.status === 200) this.suggestionToast(true);
      else this.submissionToast(false);
    })
  }

  

  suggestionToast = async (success) => {
    const toast = await this.toastController.create({
      header: success ? 'Suggestion successfully recorded':'Failed to submit suggestion',
      message: success ? 'Your suggestion will be processed soon':'Please try again later.',
      duration: 2000,
      cssClass: 'custom-toast-position',
      translucent: true,
      mode: 'md',
      color: success ? 'primary':'danger'
    });
    toast.present();
}

}
