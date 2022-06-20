import {EventEmitter, Injectable, Input, OnDestroy, Output, Type} from '@angular/core';
import { Game, Round, Subscriber, Question } from '@snowl/base-app/model';
import { animateNumber, NumAnim, randomInt } from '@snowl/base-app/util';
import { Answer } from '@snowl/base-app/model/answer';
import {interval, of, noop, timer, BehaviorSubject} from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {DialogComponentResponse} from "@snowl/base-app/shared/services/base-dialog.service";
import {BaseTieBreakerComponent} from "@snowl/base-app/game";
import {BaseDialogService} from "@snowl/base-app/shared";
import {Constructor} from 'vx-components-base';

@Injectable()
export abstract class BaseRoundDetailComponent implements OnDestroy {
  @Input() subscriber: Subscriber;
  @Input() currentPlayerCount: number;

  @Output() close = new EventEmitter();
  @Output() answerQuestion = new EventEmitter<[Answer, Question]>();

  currentQuestionIdx = 0;
  isQuestionLocked = false;
  countdown?: NumAnim;
  countdownId?: string;
  paired = false;
  person$ = interval(200).pipe(startWith(0), map(() => `person-${randomInt(0, 64)}.png`));
  userAnswer?: string;

  abstract tieBreakerComponent: Constructor<BaseTieBreakerComponent>;

  private _round: Round;
  private tieBreakerDialog?: DialogComponentResponse<undefined>;
  constructor (private dialog: BaseDialogService) {

  }

  @Input()
  get round(): Round {
    return this._round;
  }

  set round(value: Round) {
    this._round = value;
    this.paired = !!value.matchedPlayer;

    if (this.isQuestionLocked) {
      this.calcLockedQuestionIdx();
      this.checkForTieBreaker();
    }
  }

  private _game: Game;

  @Input()
  get game(): Game {
    return this._game;
  }

  set game(value: Game) {
    this._game = value;

    if (value.clientStatus === 'DEFAULT') {
      this.isQuestionLocked = false;
    } else {
      this.isQuestionLocked = true;
      this.calcLockedQuestionIdx();
    }
  }

  get canGoBack(): boolean {
    return this.currentQuestionIdx > 0 && !this.isQuestionLocked;
  }

  get canGoForward(): boolean {
    return this.currentQuestionIdx < this.round.questions.length - 1 && !this.isQuestionLocked;
  }

  get currentQuestion(): Question {
    return this.round.questions[this.currentQuestionIdx];
  }

  get waitingForQuestion(): boolean {
    return !this.currentQuestion || this.game.clientStatus === 'WAITING_FOR_QUESTION' || (this.game.clientStatus === 'HAS_QUESTION' && !!this.currentQuestion.opponentAnswer);
  }

  get waitingForOpponent(): boolean {
    return (!!this.userAnswer || (!!this.countdown && this.countdown.finished)) && !this.currentQuestion.opponentAnswer;
  }

  isIncorrect(answer: Answer): boolean {
    const currentQuestion = this.currentQuestion;
    if (!currentQuestion.correctAnswerId && this.countdown && this.countdown.finished) {
      return true;
    }
    return !!currentQuestion.correctAnswerId && currentQuestion.correctAnswerId !== answer.id;
  }

  didAnswer(answer: Answer): boolean {
    const answerId = this.currentQuestion.answer ? this.currentQuestion.answer.selectedAnswerId : '';
    return answer.id === answerId || answer.id === this.userAnswer;
  }

  sendAnswer(answer: Answer): void {
    this.answerQuestion.emit([answer, this.currentQuestion]);
    if (this.countdown) {
      this.countdown.cancel();
      this.countdown = undefined;
      this.userAnswer = answer.id;
    }
  }

  trackByAnswer(answer: Answer): string {
    return answer.id;
  }

  ngOnDestroy(): void {
    if (this.tieBreakerDialog) {
      this.tieBreakerDialog.close();
    }
  }

  private calcLockedQuestionIdx(): void {
    const [game, round] = [this.game, this.round];

    const oldQuestionIdx = this.currentQuestionIdx;
    if (!round || !game) {
      this.currentQuestionIdx = 0;
    } else {
      this.currentQuestionIdx = round.questions.length ? round.questions.length - 1 : 0;
    }

    if (oldQuestionIdx !== this.currentQuestionIdx) {
      this.userAnswer = undefined;
    }
    this.calcQuestionCountdown();
  }

  private calcQuestionCountdown(): void {
    let question: Question;
    const [game, round, questionIndex] = [this.game, this.round, this.currentQuestionIdx];
    if (!round || !game || !(question = round.questions[questionIndex])) {
      this.countdown = undefined;
      this.countdownId = undefined;
      return;
    } else if (question.id === this.countdownId) {
      //We already have a countdown for this question
      return;
    }

    this.countdownId = question.id;
    let countTime = this.round.playerMaximumDurationSeconds * 1000;
    if (question.questionPresentedTimestamp) {
      countTime -= Date.now() - question.questionPresentedTimestamp.getTime();
    }

    if (countTime <= 0) {
      this.countdown = of(0) as NumAnim;
      this.countdown.finished = true;
      this.countdown.cancel = noop;
      return;
    }

    this.countdown = animateNumber(countTime / 1000, 0, countTime, 1);
  }

  private checkForTieBreaker() {
    const tieBreakerTime = this.round.tieBreakerComingTime;

    const minTieBreakerDialog = 1500;
    if (tieBreakerTime && (tieBreakerTime.getTime() - minTieBreakerDialog) > Date.now() && !this.tieBreakerDialog) {
      this.tieBreakerDialog = this.dialog.openComponent(this.tieBreakerComponent, tieBreakerTime);

      this.tieBreakerDialog.onClose.subscribe(() => this.tieBreakerDialog = undefined);
    }
  }
}
