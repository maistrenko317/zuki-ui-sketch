import { Action } from '@ngrx/store';
import { SyncMessage } from '@snowl/base-app/model';

const SYNC_MESSAGES_RECEIVED = '[Sync Messages] Received Sync Messages';

export class SyncMessagesReceivedAction implements Action {
  static readonly type = SYNC_MESSAGES_RECEIVED;
  readonly type = SYNC_MESSAGES_RECEIVED;
  constructor(public payload: Dict<SyncMessage[]>) {}
}

const SYNC_MESSAGE_RECEIVED = '[Sync Messages] Received Sync Message';
export class SyncMessageReceivedAction implements Action {
  static readonly type = SYNC_MESSAGE_RECEIVED;
  readonly type = SYNC_MESSAGE_RECEIVED;
  constructor(public payload: SyncMessage) {}
}

export type SyncMessageActions = SyncMessagesReceivedAction | SyncMessageReceivedAction;
