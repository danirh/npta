import { Component, OnDestroy, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { GameService } from 'src/app/services/game.service';
import { WordPopupComponent } from '../word-popup/word-popup.component';

@Component({
  selector: 'app-stage-assessment',
  templateUrl: './stage-assessment.component.html',
  styleUrls: ['./stage-assessment.component.scss'],
})
export class StageAssessmentComponent implements OnInit, OnDestroy {
  inputs: any;
  invalidWords: any;
  doubleWords: any;
  correctWords: any;
  voteMap = {};
  validWordsMap = {};
  validWordsSubscription: Subscription;
  count = 0;
  constructor(private gameService: GameService, private popoverController: PopoverController) { }

  ngOnInit() {
    let inputMaps = this.gameService.getInputs();
    this.inputs = inputMaps.all;
    this.invalidWords = inputMaps.invalid;
    this.doubleWords = inputMaps.double;
    this.correctWords = inputMaps.correct;
    this.validWordsSubscription = this.gameService.getValidWords().subscribe(wordMap => {
      this.validWordsMap = wordMap;
    });
    this.gameService.fetchValidWords();
  }

  async presentWordPopover(ev,category, word) {
    ev.preventDefault();
    if(!word) return;
    const popover = await this.popoverController.create({
      component: WordPopupComponent,
      componentProps: { word, category },
      cssClass: 'word-popup-class',
      mode: 'md'
    });
    await popover.present();
  }

  toggleVote(category,input) {
    if(!input) return;
    let word = category + '_' + input; 
    if(this.invalidWords[word] || this.correctWords[word]) return;
    this.voteMap[word] = !this.voteMap[word];
    this.gameService.updateVote(word, this.voteMap[word]);
  }

  ngOnDestroy() {
    this.validWordsSubscription.unsubscribe();
  }
}
