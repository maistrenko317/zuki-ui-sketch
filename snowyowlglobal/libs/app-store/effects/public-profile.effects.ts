import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {
  LoadPublicProfilesAction,
  LoadPublicProfilesFailAction,
  LoadPublicProfilesSuccessAction,
  SyncMessageReceivedAction,
  SyncMessagesReceivedAction
} from '@snowl/app-store/actions';
import {bufferTime, catchError, filter, map, mergeMap} from 'rxjs/operators';
import {SyncMessage, UserMatchedSyncMessage} from '@snowl/base-app/model';
import {Store} from '@ngrx/store';
import {AppState} from '@snowl/app-store/reducers';
import {merge, of, zip} from 'rxjs';
import {BaseSubscriberService} from '@snowl/base-app/shared';
import {EffectsUtils} from '@snowl/app-store/effects/effects-utils.service';
import {elseMap, resultMap} from 'ts-results/rxjs-operators';

@Injectable()
export class PublicProfileEffects {
  /**
   * Watches for all sync messages and loads the public profiles for matched players
   */
  @Effect()
  shouldLoadProfiles$ = this.effectsUtils.syncMessages$.pipe(
    filter((message): message is UserMatchedSyncMessage => message.messageType === 'user_matched'),
    mergeMap(message => message.payload.players.map(player => player.subscriberId)), // Now it's a stream of subscriber ids
    bufferTime(100),
    map(idsToLoad => {
      return idsToLoad.filter((id: number, idx: number) => {
        return id && idsToLoad.indexOf(id) === idx && this.handledProfiles.indexOf(id) === -1;
      })
    }),
    filter(idsToLoad => !!idsToLoad.length),
    map(idsToLoad => {
      this.handledProfiles.push(...idsToLoad);

      return new LoadPublicProfilesAction(idsToLoad);
    })
  );

  private handledProfiles: number[] = [];

  @Effect()
  loadProfiles = this.actions$.pipe(
    ofType<LoadPublicProfilesAction>(LoadPublicProfilesAction.type),
    map(action => action.payload),
    mergeMap(allIds => this.subscriberService.loadPublicProfiles(allIds)),
    resultMap(profiles => new LoadPublicProfilesSuccessAction(profiles)),
    elseMap(err => new LoadPublicProfilesFailAction(err))
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private subscriberService: BaseSubscriberService,
    private effectsUtils: EffectsUtils
  ) {
  }
}
