import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '@snowl/app-store/reducers';
import { getCurrentGame, getCurrentPlayerCount, getCurrentRound, getSubscriber } from '@snowl/app-store/selectors';
import { AnswerQuestionAction, BackAction, CloseRoundAction } from '@snowl/app-store/actions';
import { getValue } from '@snowl/base-app/util';
import { filter } from 'rxjs/operators';
import { Question } from '@snowl/base-app/model';
import { Answer } from '@snowl/base-app/model/answer';

@Injectable()
export abstract class BaseRoundComponent {
  currentRound$ = this.store.pipe(select(getCurrentRound)).pipe(filter(round => !!round));
  currentGame$ = this.store.pipe(select(getCurrentGame));
  subscriber$ = this.store.pipe(select(getSubscriber));
  currentPlayerCount$ = this.store.pipe(select(getCurrentPlayerCount));

  constructor(protected store: Store<AppState>) {}

  closeRound(): void {
    this.store.dispatch(new CloseRoundAction());
  }

  answerQuestion([answer, question]: [Answer, Question]): void {
    this.store.dispatch(new AnswerQuestionAction({ answer, question }));
  }
}
