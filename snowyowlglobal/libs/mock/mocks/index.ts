import {MiscMocks} from "@snowl/mock/mocks/misc.mocks";
import {SubscriberMocks} from "@snowl/mock/mocks/subscriber.mocks";
import {GameMocks} from "@snowl/mock/mocks/game.mocks";
import {SyncMessageMocks} from "@snowl/mock/mocks/sync-message.mocks";
import {GameplayMocks} from "@snowl/mock/mocks/gameplay.mocks";

export {initializeDb} from './db/initialize-db';

export const MOCKS = [
  new MiscMocks(),
  new SubscriberMocks(),
  new GameMocks(),
  new SyncMessageMocks(),
  new GameplayMocks()
];
