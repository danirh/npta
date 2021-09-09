import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-stage-score',
  templateUrl: './stage-score.component.html',
  styleUrls: ['./stage-score.component.scss'],
})
export class StageScoreComponent implements OnInit {
  scores: any;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.scores = this.gameService.getScores();
  }

}
