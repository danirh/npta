import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-scorecard',
  templateUrl: './scorecard.component.html',
  styleUrls: ['./scorecard.component.scss'],
})
export class ScorecardComponent implements OnInit {
  scores: any;

  constructor(private popoverController: PopoverController, private gameService: GameService) { }

  ngOnInit() {
    this.scores = this.gameService.getScores();
  }

  dismissPopover() {
    this.popoverController.dismiss();
  }

}
