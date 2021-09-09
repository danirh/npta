import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { GameComponent } from './components/game/game.component';
import { ChatComponent } from './components/chat/chat.component';
import { MessageComponent } from './components/message/message.component';
import { StageStartComponent } from './components/stage-start/stage-start.component';
import { StageInputComponent } from './components/stage-input/stage-input.component';
import { StageAssessmentComponent } from './components/stage-assessment/stage-assessment.component';
import { StageResultComponent } from './components/stage-result/stage-result.component';
import { StageScoreComponent } from './components/stage-score/stage-score.component';
import { StageTransitionComponent } from './components/stage-transition/stage-transition.component';
import { InitialsValidatorDirective } from '../directives/initials.directive';
import { RulesComponent } from './components/rules/rules.component';
import { HelpComponent } from './components/help/help.component';
import { ScorecardComponent } from './components/scorecard/scorecard.component';
import { WordPopupComponent } from './components/word-popup/word-popup.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, GameComponent, ChatComponent, MessageComponent,StageTransitionComponent, StageStartComponent, StageInputComponent, StageAssessmentComponent, StageResultComponent, StageScoreComponent, RulesComponent, HelpComponent, ScorecardComponent,WordPopupComponent, InitialsValidatorDirective]
})
export class HomePageModule { }
