import {Injectable} from '@angular/core';
import {AppState} from '@snowl/app-store/reducers';
import {Store} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {merge, Observable} from 'rxjs';
import {SyncMessageReceivedAction, SyncMessagesReceivedAction} from '@snowl/app-store/actions';
import {map, mergeMap} from 'rxjs/operators';
import {SyncMessage} from '@snowl/base-app/model';
import {flattenArray} from '@snowl/base-app/util';

@Injectable()
export class EffectsUtils {
  private liveSyncMessages$: Observable<SyncMessage> = this.actions$.pipe(
    ofType<SyncMessageReceivedAction>(SyncMessageReceivedAction.type),
    map(action => action.payload as SyncMessage)
  );
  private oldSyncMessages$: Observable<SyncMessage> = this.actions$.pipe(
    ofType<SyncMessagesReceivedAction>(SyncMessagesReceivedAction.type),
    mergeMap(action => {
      return flattenArray(Object.values(action.payload));
    })
  );

  syncMessages$: Observable<SyncMessage> = merge(this.liveSyncMessages$, this.oldSyncMessages$);

  constructor(private actions$: Actions, private store: Store<AppState>) {}
}
