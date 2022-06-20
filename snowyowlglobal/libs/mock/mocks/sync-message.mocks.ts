import {MockApi, Mocks} from "@snowl/mock/mocks/mocks";
import {SyncMessage} from "@snowl/base-app/model";
import {getSyncMessagesForGameFromDb} from "@snowl/mock/mocks/db/sync-message.db";
import {SyncMessageResponse} from "@snowl/base-app/shared";

export class SyncMessageMocks extends Mocks {
  @MockApi(/snowl\/game\/getSyncMessages/g)
  mockGetSyncMessages(body: {gameId: string}): SyncMessageResponse {
    return {
      syncMessages: {[body.gameId]: getSyncMessagesForGameFromDb(body.gameId)},
      success: true
    };
  }
}
