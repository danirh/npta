import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { GameService } from 'src/app/services/game.service';
import { RulesComponent } from '../rules/rules.component';

@Component({
  selector: 'app-stage-start',
  templateUrl: './stage-start.component.html',
  styleUrls: ['./stage-start.component.scss'],
})
export class StageStartComponent implements OnInit {
  isHost: Observable<boolean>;
  // rounds: number = 3;
  rounds = new FormControl('3');

  constructor(private gameService: GameService, private popoverController: PopoverController) { }

  ngOnInit() {
    this.isHost = this.gameService.checkIfHost();
  }

  onStartGame() {
    this.gameService.startGame(this.rounds.value);
  }

  onShareGame() {
    this.gameService.shareGame();
  }

  async openRules() {
    const popover = await this.popoverController.create({
      component: RulesComponent,
      cssClass: 'rules-popup-class',
      mode: 'md'
    });
    await popover.present();
  }
}
