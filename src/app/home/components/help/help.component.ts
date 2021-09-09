import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit {
  @Input() stage: string;
  helpTexts = new Map([
    ["input",
      [
        "30 sec to jot down a Name, Place, Thing and an Animal",
        "‘LOCK’ your answers sooner to get bonus points",
        "You can change your answers after ‘LOCK’ing. Just make sure you lock them again"
      ]
    ],
    ["assessment",
      [
        "Upvote a word by Tapping on it",
        "Tap again to discard your vote",
        "A word is considered correct if it has a majority of upvotes or is in our vocabulary",
        "Green highlighted: Correct and Unique words",
        "Yellow highlighted: Correct but Non-unique words",
        "Striked-off: Invalid words",
        "Thumbs Up: Upvoted by you",
        "Words used in a previous round will be considered invalid"
      ]
    ],
    ["score",
      [
        "Correct and Unique word: 10 points",
        "Correct but Non-Unique word: 5 points",
        "Time bonus: Time Left / 30 * Initial Score"
      ]
    ],
  ]);

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {
  }

  dismissPopover() {
    this.popoverController.dismiss();
  }
}
