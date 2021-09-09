import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Observable, interval, Subscription } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { GameService } from 'src/app/services/game.service';
import { HelpComponent } from '../help/help.component';
import { ScorecardComponent } from '../scorecard/scorecard.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  stage: string;
  stageSubscription: Subscription;
  round: Observable<string | number>;
  stageTimer: Observable<any>;
  headerShown: boolean = false;

  @HostBinding('class.disabled') viewOnly: boolean = true;

  constructor(private gameService: GameService, private popoverController: PopoverController) { }

  ngOnInit() {
    this.gameService.getViewOnlyStatus().subscribe(status => {
      this.viewOnly = status;
    });
    this.stageSubscription = this.gameService.getStage().subscribe(stage => {
      this.stage = stage;
      if (stage === "transition" || stage === "input" || stage === "assessment" || stage === "score")
        this.headerShown = true;
      else this.headerShown = false;
    });
    this.round = this.gameService.getRound();
    this.gameService.getTimer().subscribe((time) => {
      this.stageTimer = interval(1000).pipe(take(time), map(t => {
        let countDown = time - t - 1;
        let min = Math.trunc(countDown / 60);
        let sec = countDown % 60;
        return { min, sec };
      }))
    })
    this.gameService.handleGame();
  }

  async openStageHelp(stage) {
    switch (stage) {
      case "input":
      case "assessment":
      case "score":
        const popover = await this.popoverController.create({
          component: HelpComponent,
          cssClass: 'rules-popup-class',
          componentProps: {stage},
          mode: 'md'
        });
        await popover.present();
        break;
      default: break;
    }
  }

  async openScorecard() {
    const popover = await this.popoverController.create({
      component: ScorecardComponent,
      cssClass: 'rules-popup-class',
      mode: 'md'
    });
    await popover.present();

  }

  ngOnDestroy() {
    this.stageSubscription.unsubscribe();
  }

}
