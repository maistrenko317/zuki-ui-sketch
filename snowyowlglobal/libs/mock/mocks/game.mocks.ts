import {MockApi, Mocks} from "@snowl/mock/mocks/mocks";
import {Count, Game, ServerGame} from "@snowl/base-app/model";
import {getGamesFromDb, getGameFromDb, getGamePlayerCountFromDb} from "@snowl/mock/mocks/db/game.db";

export class GameMocks extends Mocks {
  @MockApi(/snowl_games.json/g)
  mockSnowlGames(): ServerGame[] {
    return getGamesFromDb();
  }

  @MockApi(/wds\/(.*?)\/game.json/)
  mockGetGame(_: any, id: string): ServerGame {
    return getGameFromDb(id);
  }

  @MockApi(/wds\/(.*?)\/currentPlayerCount.json/)
  mockCurrentPlayerCount(_: any, id: string): Count<'currentPlayerCount'> {
    return { currentPlayerCount: getGamePlayerCountFromDb(id) };
  }
}
