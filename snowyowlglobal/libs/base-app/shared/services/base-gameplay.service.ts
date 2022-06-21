import {Injectable} from '@angular/core';
import {BaseHttpService} from './base-http.service';
import {
  Count, Game,
  QuestionSyncMessage,
  ShoutResponse
} from '@snowl/base-app/model';
import {catchError, delay, map, mapTo, retryWhen, switchMap, switchMapTo, take} from 'rxjs/operators';
import {decryptAES, getValue} from '@snowl/base-app/util';
import {Question} from '@snowl/base-app/model/question';
import {concat, Observable, of, throwError, timer} from 'rxjs';
import {BaseSocketService} from "./base-socket.service";
import {select, Store} from '@ngrx/store';
import {getClientTimeDrift, getCurrentPlayerCount, getGameEntities} from "@snowl/app-store/selectors";
import {CurrentGameCountAction} from "@snowl/app-store/actions";
import {LogService} from "@snowl/base-app/shared/services/log.service";
import {AppState} from "@snowl/app-store/reducers";
import {Err, Ok, Result} from 'ts-results';
import {ShoutErrorResponse} from '@snowl/base-app/error';
import {resultMap, resultSwitchMap} from 'ts-results/rxjs-operators';

@Injectable()
export class BaseGameplayService {
  private gameEntities$ = this.store.pipe(select(getGameEntities));

  constructor(protected http: BaseHttpService, protected logger: LogService, protected store: Store<AppState>) {
  }

  decryptQuestion(toDecrypt: QuestionSyncMessage): Observable<Result<Question, ShoutErrorResponse<DecryptKeyResponse>>> {
    return this.http
      .sendSynchronousCollectorRequest<DecryptKeyResponse>('/snowl/question/getDecryptKey', {
        subscriberQuestionAnswerId: toDecrypt.payload.subscriberQuestionAnswerId
      })
      .pipe(
        resultMap(resp => {
          const questionText = decryptAES(resp.decryptKey, toDecrypt.payload.question);
          const question = JSON.parse(questionText) as Question;
          const timeDrift = getValue(this.store.pipe(select(getClientTimeDrift)));
          this.logger.log('Calculated client-server time drift of: ' + timeDrift + 'ms');
          question.questionPresentedTimestamp = new Date(resp.questionPresentedTimestamp.getTime() + timeDrift);
          question.subscriberQuestionAnswerId = toDecrypt.payload.subscriberQuestionAnswerId;
          return question;
        })
      );
  }

  joinGame(gameId: string): Observable<Result<JoinGameResponse, ShoutErrorResponse<JoinGameResponse>>> {
    return this.http.sendCollectorRequest<JoinGameResponse>('/snowl/game/join', {gameId});
  }

  joinPrivateGame(inviteCode: string): Observable<Result<JoinGameResponse, ShoutErrorResponse<JoinGameResponse>>> {
    return this.http.sendCollectorRequest<JoinGameResponse>('/snowl/game/joinViaInviteCode', {inviteCode});
  }

  beginPoolPlay(gameId: string): Observable<Result<ShoutResponse, ShoutErrorResponse<BeginPoolPlayResponse | JoinGameResponse>>> {
    let joinFreeplay$: Observable<Result<any, ShoutErrorResponse<JoinGameResponse>>> = of(Ok(null));

    // Checks to see if we need to join freeplay
    const entities = getValue(this.gameEntities$);
    if (!entities[gameId] || !entities[gameId].userJoinedFreeplay) {
      joinFreeplay$ = this.joinFreeplayGame(gameId);
    }

    const poolPlayResult = this.http.sendCollectorRequest<BeginPoolPlayResponse>('/snowl/game/beginPoolPlay', {gameId});
    return joinFreeplay$.pipe(resultSwitchMap(() => poolPlayResult));
  }

  submitAnswer(subscriberQuestionAnswerId: string, selectedAnswerId: string): Observable<Result<ShoutResponse, ShoutErrorResponse<SubmitAnswerResponse>>> {    
    // const response = this.http.sendCollectorRequest<SubmitAnswerResponse>('/snowl/question/submitAnswer', {
    //   subscriberQuestionAnswerId,
    //   selectedAnswerId
    // });
    const response = this.http.delayedCollectorRequest<SubmitAnswerResponse>(5000, '/snowl/question/submitAnswer', {
      subscriberQuestionAnswerId,
      selectedAnswerId
    })
    return response;
  }

  getNumPlayers(gameId: string, roundId: string): Observable<number> {
    return this.http.getWdsDoc<Count>(`/${gameId}/numplayers_${roundId}.json`).pipe(
      map(value => {
        return value.count;
      })
    );
  }

  getTotalPlayers(gameId: string): Observable<number> {
    return this.http
      .getWdsDoc<Count<'currentPlayerCount'>>(`/${gameId}/currentPlayerCount.json`)
      .pipe(map(count => count.currentPlayerCount), catchError(() => of(0)));
  }

  getBracketCountdownTime(gameId: string): Observable<number> {
    return this.http.getWdsDoc<Count<'beginsInMs'>>(`/${gameId}/bracketplay_countdown.json`).pipe(
      map(count => count.beginsInMs),
      map(time => time < 0 ? 0 : time),
      retryWhen(errors => concat(errors.pipe(delay(150), take(3)), throwError('No countdown'))),
      catchError((e) => {
        this.logger.error('Failed retrieving bracketplay_countdown.json doc', e);
        return of(0)
      })
    )
  }

  private joinFreeplayGame(gameId: string): Observable<Result<JoinGameResponse, ShoutErrorResponse<JoinGameResponse>>> {
    return this.http.sendCollectorRequest<JoinGameResponse>('/snowl/game/freeplay', {gameId});
  }
}


export interface DecryptKeyResponse extends ShoutResponse<'illegalAnswerState'> {
  decryptKey: string;
  questionPresentedTimestamp: Date;
}

export interface JoinGameResponse extends ShoutResponse<'gameNotOpen' | 'accessDenied' | 'alreadyJoined' | 'noOpenRounds' | 'invalidParam'> {
  gameId: string;
}

export interface BeginPoolPlayResponse extends ShoutResponse<'notInGame' | 'roundNotFound' | 'waitForBracketPlayToBegin' | 'alreadyQueued' | 'roundNotOpen' | 'insufficientFunds' | 'roundLocked'> {
  // roundLocked?: true; // - a server contention issue. Very unlikely to happen. Client should wait a small amount of time (100ms) and then retry
}

interface SubmitAnswerResponse extends ShoutResponse<'illegalAnswerState' | 'duplicateAnswer' | 'answerTooLate' | 'questionAnsweredButNotShown'> {

}
