import {ServerGame} from "@snowl/base-app/model";
import {getRandomDbPayoutModel} from "@snowl/mock/mocks/db/payout-model.db";
import {uuid} from "@snowl/base-app/util";

const games: ServerGame[] = [];
const playerCounts: number[] = [];

export function addGameToDb() {
  const idx = games.length;
  games.push({
    allowableAppIds: [1],
    allowableLanguageCodes: ['en'],
    allowBots: true,
    bracketEliminationCount: 1,
    canAppearInMobile: true,
    cancelledDate: null,
    closedDate: null,
    extras: {
      minimumPayoutAmount: 1,
      costToJoin: 1,
      topPayout: 20,
      payoutModelId: 1,
      freeplayNotificationSent: false
    },
    fetchingActivityTitles: {
      en: 'Loading'
    },
    forbiddenCountryCodes: [],
    gameDescriptions: {
      en: `Game ${idx + 1} description`
    },
    gameNames: {
      en: `Game ${idx + 1} name`
    },
    gamePhotoUrl: null,
    gameStatus: 'OPEN',
    guideHtmls: {
      en: `<html><body>Some Fance Game Guide!</body></html>`
    },
    id: idx.toString(),
    includeActivityAnswersBeforeScoring: false,
    inplayDate: null,
    openDate: new Date(),
    pendingDate: null,
    maxLivesCount: 5,
    startingLivesCount: 2,
    additionalLivesCost: 0.5,
    rounds: [
      {
        categories: ['*'],
        expectedOpenDate: new Date(Date.now() + (1000 * 60 * 15)),
        gameId: idx.toString(),
        id: uuid(),
        maximumActivityCount: 3,
        currentPlayerCount: 0,
        minimumActivityToWinCount: 2,
        playerMaximumDurationSeconds: 10,
        roundNames: {
          en: `Game ${idx + 1} Round 1`
        },
        roundSequence: 1,
        roundStatus: 'OPEN',
        roundType: 'POOL',
        maximumPlayerCount: 100
      },
      {
        categories: ['*'],
        expectedOpenDate: new Date(Date.now() + (1000 * 60 * 30)),
        gameId: idx.toString(),
        id: uuid(),
        maximumActivityCount: 3,
        currentPlayerCount: 0,
        minimumActivityToWinCount: 2,
        playerMaximumDurationSeconds: 10,
        roundNames: {
          en: `Game ${idx + 1} Round 2`
        },
        roundSequence: 2,
        roundStatus: 'CLOSED',
        roundType: 'BRACKET',
        maximumPlayerCount: 100
      }
    ],
    submittingActivityTitles: {
      en: 'Submitting Answer...'
    },

  });

  playerCounts.push(0);
}

export function getGamesFromDb(): ServerGame[] {
  return games;
}

export function getGameFromDb(id: string): ServerGame {
  return games[+id];
}

export function getGamePlayerCountFromDb(id: string): number {
  return playerCounts[+id];
}

export function increaseGamePlayerCountDb(id: string): void {
  playerCounts[+id] = playerCounts[+id] + 1;
}
