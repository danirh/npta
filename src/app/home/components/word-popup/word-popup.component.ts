import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-word-popup',
  templateUrl: './word-popup.component.html',
  styleUrls: ['./word-popup.component.scss'],
})
export class WordPopupComponent implements OnInit {
  @Input() word: string;
  @Input() category: string;

  constructor(private gameService: GameService, private popoverController: PopoverController) { }

  ngOnInit() {}

  suggestToAddWord() {
    let wordWithCategory = this.category + '_' + this.word;
    this.gameService.suggestWord(wordWithCategory,"ADD");
    this.popoverController.dismiss();
  }

  suggestToRemoveWord() {
    let wordWithCategory = this.category + '_' + this.word;
    this.gameService.suggestWord(wordWithCategory,"DELETE");
    this.popoverController.dismiss();
  }
}
