import { Component, ElementRef, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { GameService } from 'src/app/services/game.service';
import { InputModel } from './inputModel';

@Component({
  selector: 'app-stage-input',
  templateUrl: './stage-input.component.html',
  styleUrls: ['./stage-input.component.scss'],
})
export class StageInputComponent implements OnInit, OnDestroy {
  letter: string;
  locked: boolean;
  model = new InputModel("", "", "", "");
  triggerSubscription: Subscription;
  constructor(private gameService: GameService, private toastController: ToastController) { }

  @HostBinding("class.submitting") submitting: boolean;

  ngOnInit() {
    this.letter = this.gameService.getLetter();
    this.triggerSubscription = this.gameService.submissionTrigger.subscribe(() => {
      this.submitting = true;
      if(!this.locked) this.gameService.saveInput(this.model);
    });
  }

  onLock() {
    this.gameService.saveInput(this.model, true);
    this.locked = true;
  }

  onChange() {
    this.locked = false;
  }

  ngOnDestroy() {
    this.triggerSubscription.unsubscribe();
  }

  async showSubmittingToast() {
    const toast = await this.toastController.create({
      message: 'Submitting your inputs',
      duration: 2000,
      cssClass: 'custom-toast-position',
      translucent: true,
      mode: 'md',
      color: 'primary'
    });
    toast.present();
  }
}
