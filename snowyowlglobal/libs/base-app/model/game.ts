import { Localized } from './localized';
import {fillRoundFromJson, Round, ServerRound} from './round';
import { PayoutLevel } from './payout-level';
import { GamePlayer } from './game-player';
import { SyncMessage } from '@snowl/base-app/model/sync-message';
import {PayoutModel} from "@snowl/base-app/model/payout-model";
import {GamePayoutLevel, GamePayouts} from '@snowl/base-app/model/game-payout';

interface BaseGame {
  id: string;
  gameNames: Localized;
  gameDescriptions: Localized;
  fetchingActivityTitles: Localized; // "Retrieving Question" for example. clint should display this value in the UI when retrieving a question
  submittingActivityTitles: Localized; // "Submitting Answer" for example. client should display this value in the UI when submitting an answer
  guideHtmls: Localized;
  guideUrl?: string;
  allowableAppIds: number[];
  allowableLanguageCodes: string[];
  forbiddenCountryCodes: string[];
  gameStatus: GameStatus;
  gamePhotoUrl: string | null;
  bracketEliminationCount: number;
  allowBots: boolean;
  // payoutCalculationMethod: 'STATIC' | 'DYNAMIC';
  includeActivityAnswersBeforeScoring: boolean;
  pendingDate: Date | null;
  cancelledDate: Date | null;
  openDate: Date | null;
  inplayDate: Date | null;
  closedDate: Date | null;
  canAppearInMobile: boolean;
  startingLivesCount: number;
  maxLivesCount: number;
  additionalLivesCost: number;
  extras: {
    minimumPayoutAmount: number;
    freeplayNotificationSent: boolean;
    costToJoin: number;
    topPayout: number;
    payoutModelId: number;
  }
}

export interface ExtraGameFields {
  //Fields below here were added by aidan to make development easier
  categoryIds: string[];
  bracketRound: string;
  bracketSequence: number;
  expectedStartDateForBracketPlay: Date;
  expectedStartDateForPoolPlay: Date;
  costToJoin: number;
  // payout: number;
  currentRound?: string;
  userJoinedGame: boolean;
  userJoinedFreeplay: boolean;
  clientStatus: GameClientStatus;
  wonAmount?: number;
  userEliminated: boolean;
  eliminatedRound?: number;

  wasSaved: boolean;
  playStatus: PlayStatus;
  hasLoadedSyncMessages: boolean;
  hasParsedSyncMessages: boolean;
  topPayout: number;
  totalPlayers: number;
  maximumPlayerCount: number;
  numRemainingLives: number;
  hasPoolRounds: boolean;
  payouts?: GamePayouts;
  actualPayout?: GamePayoutLevel;
  loadingActualPayout: boolean;
}

export interface Game extends BaseGame, ExtraGameFields {
  rounds: Round[];
}

export interface NormalizedGame extends BaseGame, ExtraGameFields {
  rounds: string[];
}

export interface ServerGame extends BaseGame{
  rounds: ServerRound[];
}

export type GameStatus = 'PENDING' | 'OPEN' | 'INPLAY' | 'CLOSED' | 'CANCELLED';
export type PlayStatus = 'UPCOMING' | 'POOL' | 'BRACKET' | 'FINISHED';
export type GameClientStatus =
  | 'DEFAULT'
  | 'WAITING_FOR_MATCH'
  | 'WAITING_FOR_QUESTION'
  | 'HAS_QUESTION'
  | 'WAITING_FOR_MATCH_RESULT';

export function fillGameFromJson(game: Game): Game {
  game.clientStatus = game.clientStatus || 'DEFAULT';
  game.userJoinedGame = game.userJoinedGame || false;
  game.userJoinedFreeplay = game.userJoinedFreeplay || false;
  game.userEliminated = game.userEliminated || false;
  game.wasSaved = game.wasSaved || false;
  game.hasLoadedSyncMessages = game.hasLoadedSyncMessages || false;
  game.loadingActualPayout = game.loadingActualPayout || false;
  game.numRemainingLives = game.bracketEliminationCount;
  game.hasPoolRounds = false;

  if (!game.totalPlayers) {
    game.totalPlayers = 0;
  }

  if (game.extras) {
    game.topPayout = game.extras.topPayout;
    game.costToJoin = game.extras.costToJoin;
  } // TODO: how to handle old games?

  const categoryIds = [];
  let roundNum = 1;
  for (const round of game.rounds) {
    fillRoundFromJson(round);

    categoryIds.push(...round.categories);
    if (round.isBracketRound && (!game.bracketSequence || game.bracketSequence === round.roundSequence)) {
      game.bracketRound = round.id;
      game.bracketSequence = round.roundSequence;
      game.expectedStartDateForBracketPlay = round.expectedOpenDate;
      roundNum = 1;
    } else if (!round.isBracketRound) {
      game.expectedStartDateForPoolPlay = round.expectedOpenDate;
      game.hasPoolRounds = true;
    }

    if (round.maximumPlayerCount) {
      game.maximumPlayerCount = round.maximumPlayerCount;
    }

    round.roundName = round.isBracketRound ? `Tournament Round ${roundNum}` : `Warmup Round ${roundNum}`;
    roundNum++;
  }
  game.categoryIds = Array.from(new Set(categoryIds));

  if (!game.costToJoin) {
    game.costToJoin = 0;
  }
  const hasPoolPlayStarted = !!game.rounds.length && game.rounds[0].roundStatus !== 'VISIBLE';
  switch (game.gameStatus) {
    case 'PENDING':
      game.playStatus = 'UPCOMING';
      break;
    case 'OPEN':
      game.playStatus = hasPoolPlayStarted ? 'POOL' : 'UPCOMING';
      break;
    case 'INPLAY':
      game.playStatus = 'BRACKET';
      break;
    case 'CANCELLED':
    case 'CLOSED':
    default:
      game.playStatus = 'FINISHED';
      break;
  }

  return game;
}
