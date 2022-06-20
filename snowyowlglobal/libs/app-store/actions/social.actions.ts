import {Action} from '@ngrx/store';
import {Game, Subscriber} from '@snowl/base-app/model';

const INVITE_FRIENDS = '[Game] Invite Friends';
export class InviteFriendsAction implements Action {
  static readonly type = INVITE_FRIENDS;
  readonly type = INVITE_FRIENDS;

  constructor(public sub?: Subscriber, public game?: Game) {}
}

export type SOCIAL_ACTIONS = InviteFriendsAction;
