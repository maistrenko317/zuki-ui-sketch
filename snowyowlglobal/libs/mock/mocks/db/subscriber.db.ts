import {ServerSubscriber, Subscriber} from "@snowl/base-app/model";
import {uuid} from "@snowl/base-app/util";
import {MockError} from "@snowl/mock/mock-error";
import {mockSettings} from "@snowl/mock/mock.settings";

let currentSession: string | null = null;

let subNumber = 1;
const subs: {
  [id: number]: ServerSubscriber;
  [email: string]: ServerSubscriber;
} = {};

const sessions: {[sessionKey: string]: ServerSubscriber} = {};

export function addSubscriberToDb(email: string, password: string, nickname: string, photoUrl = ''): ServerSubscriber {
  const sub: ServerSubscriber = {
    subscriberId: subNumber,
    nickname,
    photoUrl,
    primaryIdHash: uuid(),
    password,
    email,
    firstName: '',
    lastName: '',
    fullName: '',
    role: 'USER',
    roles: ['USER'],
    notificationPreference: 'NONE',
    wallet: 30,
    availableWallet: 0,
    gamePlayers: []
  };

  subs[sub.subscriberId] = sub;
  subs[sub.email] = sub;

  subNumber++;

  return sub;
}

export function setCurrentSession(sessionKey: string | null): void {
  currentSession = sessionKey;
}

export function addSessionToDb(key: string, subId: number): void {
  sessions[key] = subs[subId];
}

export function getLoggedInSubIdFromDb(): number {
  if (mockSettings.allowAllSessionKeys && currentSession && !sessions[currentSession]) {
    sessions[currentSession] = subs[1];
  }

  if (!currentSession || !sessions[currentSession])
    throw new MockError('subscriberNotFound');

  return sessions[currentSession].subscriberId;
}
export function getLoggedInSubFromDb(): Subscriber {
  if (mockSettings.allowAllSessionKeys && currentSession && !sessions[currentSession]) {
    sessions[currentSession] = subs[1];
  }

  if (!currentSession || !sessions[currentSession])
    throw new MockError('subscriberNotFound');

  return sessions[currentSession];
}

export function getSubscriberFromDbById(id: number): Subscriber {
  return subs[id];
}

export function getSubscriberFromDbByEmail(email: string): ServerSubscriber {
  return subs[email];
}

export function getNewBotFromDb(): Subscriber {
  return addSubscriberToDb(`playerbot_${subNumber}@mbot.com`, '', `playerbot_${subNumber}`, 'https://icons.veryicon.com/png/o/miscellaneous/intellectual-property/robot-24.png');
}
