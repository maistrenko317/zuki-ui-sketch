import { Localized } from './localized';
import { GamePlayer } from '@snowl/base-app/model/game-player';
import { PublicProfile } from '@snowl/base-app/model/public-profile';

export interface Subscriber extends PublicProfile {
  subscriberId: number;
  nickname: string;
  photoUrl: string;
  primaryIdHash: string;

  // fields below are unique to subscriber
  // nicknameSet: boolean;
  // photoUrlSmall: string;
  // photoUrlLarge: string;
  email: string;
  // emailVerified: boolean;
  firstName: string;
  lastName: string;
  fullName: string;
  // languageCode: keyof Localized;
  // phone?: string;
  // phoneVerified: boolean;
  // appId: number;
  // countryCode: string;
  // dateOfBirth: Date;
  // currencyCode: string;
  role: 'USER' | 'ADMIN' | 'TESTER';
  roles: (string | 'AFFILIATE')[];

  // Fields below here added by Aidan
  notificationPreference: SubscriberNotificationPreference;
  wallet: number;
  availableWallet: number;
  gamePlayers: GamePlayer[];
}

export interface ServerSubscriber extends Subscriber {
  password: string;
}
export type SubscriberNotificationPreference = 'NONE' | 'SMS' | 'EMAIL' | 'APP_PUSH' | 'NOT_SET';

export function fillSubscriberFromJson(sub: Subscriber): Subscriber {
  sub.notificationPreference = sub.notificationPreference || 'NOT_SET';
  sub.gamePlayers = sub.gamePlayers || [];
  if (sub.firstName === 'NYI') {
    sub.firstName = '';
  }
  if (sub.lastName === 'NYI') {
    sub.firstName = '';
  }
  return sub;
}
