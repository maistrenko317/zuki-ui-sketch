import {Inject, Injectable} from '@angular/core';
import {BaseHttpService} from './base-http.service';
import {fillGameFromJson, Game, GamePayoutLevel, GamePayouts, PayoutModelRound, ShoutResponse} from '../../model';
import {Observable, of, zip} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {AppState} from '@snowl/app-store/reducers';
import {NormalizedGame, Round, SyncMessage} from '@snowl/base-app/model';
import {NormalizedResponse, normalizeGame} from '@snowl/app-store/normalizer';
import {getGameEntities, getIsLoggedIn, getRoundEntities, getSubscriber} from "@snowl/app-store/selectors";
import {syncMessageFromJson} from "@snowl/base-app/model/sync-message";
import {Platform, PLATFORM} from "@snowl/base-app/tokens";
import {Ok, Result} from 'ts-results';
import {ShoutErrorResponse} from '@snowl/base-app/error';
import {elseMapTo, resultMap} from 'ts-results/rxjs-operators';
import {getValue} from '@snowl/base-app/util';
import {HttpErrorResponse} from '@angular/common/http';

let hasLoadedAllSyncMessages = false;

@Injectable()
export class BaseGameService {
  private loggedIn$ = this.store.pipe(select(getIsLoggedIn));

  constructor(private http: BaseHttpService, private store: Store<AppState>, @Inject(PLATFORM) private platform: Platform) {
  }

  loadGames(): Observable<{ games: NormalizedGame[]; rounds: Round[]; }> {
    const subscriber = getValue(this.store.pipe(select(getSubscriber)));
    let url = '/snowl_games.json';

    if (subscriber && subscriber.role === 'TESTER') {
      url = '/snowl_test_games.json';
    }
    return zip(this.http.getWdsDoc<Game[]>(url), this.getPrivateGames()).pipe(
      switchMap(([gamesToLoad, privateGameIds]) => {

        gamesToLoad = gamesToLoad.filter((game: Game) => {
          return !(this.platform === 'Mobile' && !game.canAppearInMobile); // TODO: Filter by language as well
        });

        if (!gamesToLoad.length && !privateGameIds.length) {
          return of({games: [], rounds: []});
        }

        return zip(
          ...gamesToLoad.map(g => this.getGameById(g.id)),
          ...privateGameIds.map(g => this.getGameById(g))
        ).pipe(
          map((normalized: NormalizedResponse[]) => {
            const rounds: Round[] = [];
            const games = normalized.map(n => {
              // TODO: kinda a kludgy place to put this line
              n.game.hasLoadedSyncMessages = true;

              rounds.push(...n.rounds);
              return n.game;
            }).sort((game, game2) => {
              return game.expectedStartDateForBracketPlay > game2.expectedStartDateForBracketPlay ? 1 : -1;
            });

            return {rounds, games};
          })
        );
      })
    );
  }

  getGameById(id: string): Observable<NormalizedResponse> {
    return this.loadGameFromWds(id).pipe(
      map((game) => {
        const existing = getValue(this.store.pipe(select(getGameEntities)))[game.id];
        const rounds = getValue(this.store.pipe(select(getRoundEntities)));

        // Update the existing game, or fill in the missing fields
        if (existing) {
          game = {
            ...existing,
            ...game,
            rounds: game.rounds.map(round => ({
              ...rounds[round.id],
              ...round
            }))
          };
        }

        fillGameFromJson(game);

        return normalizeGame(game);
      })
    );
  }


  loadGamePayouts(id: string): Observable<GamePayouts> {
    return this.http.getWdsDoc<GamePayouts>(`/${id}/payout.json`);
  }

  loadGameActualPayouts(id: string): Observable<GamePayoutLevel> {
    return this.http.getWdsDoc<GamePayoutLevel>(`/${id}/actualPayout.json`);
  }

  scalePayoutTable(payoutModelId: number, minimumPayoutAmount: number, expectedNumPlayers: number): Observable<PayoutModelRound[]> {
    return this.http.sendSynchronousCollectorRequest<PayoutsResponse>('/snowl/game/previewPayoutTable', {
      expectedNumPlayers,
      payoutModelId,
      minimumPayoutAmount
    }).pipe(
      resultMap(resp => resp.payouts.sort((a, b) => a.startingPlayerCount - b.startingPlayerCount)),
      elseMapTo([])
    );
  }

  private loadGameFromWds(id: string): Observable<Game> {
    return this.http.getWdsDoc<Game>(`/${id}/game.json`);
  }

  loadSyncMessagesForGame(gameId: string, fromDate = new Date('2001-07-19T22:17:00.683Z')):
    Observable<Result<SyncMessage[], ShoutErrorResponse<SyncMessageResponse>>> {

    if (!getValue(this.loggedIn$)) return of(Ok([]));
    const gameEntities = getValue(this.store.pipe(select(getGameEntities)));

    // We have already retrieved sync messages for this game.
    if (gameEntities[gameId] && gameEntities[gameId].hasLoadedSyncMessages) return of(Ok([]));

    return this.http
      .sendCollectorRequest<SyncMessageResponse>('/snowl/game/getSyncMessages', {fromDate, gameId})
      .pipe(
        resultMap((resp) => {
          return resp.syncMessages[gameId].map(syncMessageFromJson).sort((a, b) => (a.createDate > b.createDate ? 1 : -1));
        })
      );
  }

  loadAllSyncMessages(fromDate = new Date('2001-07-19T22:17:00.683Z')): Observable<Result<Dict<SyncMessage[]>, ShoutErrorResponse<SyncMessageResponse>>> {
    if (hasLoadedAllSyncMessages || !getValue(this.loggedIn$)) return of(Ok({}));

    hasLoadedAllSyncMessages = true;

    return this.http
      .sendCollectorRequest<SyncMessageResponse>('/snowl/game/getSyncMessages', {fromDate})
      .pipe(
        resultMap((resp: SyncMessageResponse) => {
          for (const [gameId, syncMessages] of Object.entries(resp.syncMessages)) {
            resp.syncMessages[gameId] = syncMessages.map(syncMessageFromJson).sort((a, b) => (a.createDate > b.createDate ? 1 : -1));
          }

          return resp.syncMessages;
        })
      );
  }

  private getPrivateGames(): Observable<string[]> {
    const loggedIn = getValue(this.loggedIn$);
    if (!loggedIn)
      return of([]);

    return this.http.sendCollectorRequest<PrivateGameListResponse>('/snowl/games/getPrivateList').pipe(
      resultMap(resp => resp.gameIds),
      elseMapTo([])
    );
  }
}

interface PayoutsResponse extends ShoutResponse {
  payouts: PayoutModelRound[]
}

export interface SyncMessageResponse extends ShoutResponse {
  syncMessages: Dict<SyncMessage[]>;
}

export interface PrivateGameListResponse extends ShoutResponse {
  gameIds: string[];
}
