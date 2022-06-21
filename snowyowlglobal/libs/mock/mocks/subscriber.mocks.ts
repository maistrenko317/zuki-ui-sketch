import {MockApi, Mocks} from "@snowl/mock/mocks/mocks";
import {Mock} from "protractor/built/driverProviders";
import {
  LoginResponse,
  ProfileResponse,
  SubscriberDetailsResponse
} from "@snowl/base-app/shared/services/base-subscriber.service";
import {
  addSessionToDb,
  getLoggedInSubFromDb,
  getSubscriberFromDbByEmail,
  getSubscriberFromDbById
} from "@snowl/mock/mocks/db/subscriber.db";
import {encryptAES, getPublicProfileFromSubscriber} from "@snowl/mock/mocks/mock-util";
import {MockError} from "@snowl/mock/mock-error";
import {uuid} from "@snowl/base-app/util";

export class SubscriberMocks extends Mocks {
  @MockApi(/snowl\/player\/details/g)
  mockPlayerDetails(): SubscriberDetailsResponse {
    const sub = getLoggedInSubFromDb();

    return {
      balance: sub.wallet,
      availableBalance: sub.availableWallet,
      gamePlayers: sub.gamePlayers,
      profile: getLoggedInSubFromDb(),
      prefs: [],
      success: true
    }
  }

  @MockApi(/subscriber\/getPublicProfile/)
  mockGetPublicProfile(body: {subscriberIds: number[]}): ProfileResponse {
    body.subscriberIds = body.subscriberIds || [];
    return {
      profiles: body.subscriberIds.map(getSubscriberFromDbById),
      success: true
    }
  }

  @MockApi(/auth\/login/, {waitTime: 2500})
  mockLogin(body: {email: string, password: string}): LoginResponse {
    const sub = getSubscriberFromDbByEmail(body.email);
    if (sub && sub.password === body.password) {
      const encryptedSub = encryptAES(JSON.stringify(sub));
      const sessionKey = uuid();
      addSessionToDb(sessionKey, sub.subscriberId);

      const encryptedSessionKey = encryptAES(sessionKey);
      return {
        success: true,
        sessionKey: encryptedSessionKey.result,
        subscriber: encryptedSub.result,
        ticketResponse: {
          encryptKey: encryptedSub.decryptKey,
          estimatedWaitTime: 0,
          ticket: ''
        }
      }
    } else {
      throw new MockError('invalidLogin');
    }
  }
}
