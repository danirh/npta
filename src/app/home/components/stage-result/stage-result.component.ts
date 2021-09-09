import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { timer } from "rxjs";

@Component({
  selector: 'app-stage-result',
  templateUrl: './stage-result.component.html',
  styleUrls: ['./stage-result.component.scss'],
})
export class StageResultComponent implements OnInit {
  winners: any = {};
  isDisabled: boolean = true;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.winners = this.gameService.getWinners();
    timer(5000).subscribe(()=>this.isDisabled = false);
  }

  newGame() {
    this.gameService.newGame();
  }

}
