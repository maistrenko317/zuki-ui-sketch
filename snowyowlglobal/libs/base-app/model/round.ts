 import { Localized } from './localized';
import { MatchPlayer } from './match-player';
import { QuestionResultSyncMessage, QuestionSyncMessage } from './sync-message';
import { Question } from './question';
import { RoundPlayer } from '@snowl/base-app/model/round-player';
export interface ServerRound {
  id: string;
  gameId: string;
  roundNames: Localized;
  categories: string[]; // Should be categoryIds
  roundSequence: number;
  roundType: RoundType;
  roundStatus: RoundStatus;
  // finalRound: boolean;
  // roundPurse: number | null;
  currentPlayerCount: number;
  maximumPlayerCount: number;
  // minimumMatchCount: number;
  // maximumMatchCount: number | null;
  minimumActivityToWinCount: number;
  maximumActivityCount: number;
  // costPerPlayer: number;
  // matchGlobal: boolean;
  // createDate: Date;
  // durationBetweenActivitiesSeconds: number;
  // matchPlayerCount: number;
  // activityMaximumDurationSeconds: number;
  playerMaximumDurationSeconds: number;
  // roundActivityType: string;
  // roundActivityValue: string;
  expectedOpenDate: Date;
}
export type RoundType = 'POOL' | 'BRACKET';

export interface Round extends ServerRound {
  // Attributes added below here are from Aidan
  isBracketRound: boolean;
  userJoinedRound: boolean;
  matchedPlayer?: MatchPlayer;
  myLives?: number;
  myTotalLives?: number;
  opponentLives?: number;
  opponentTotalLives?: number;
  encryptedQuestions: QuestionSyncMessage[];
  finished: boolean;
  questions: Question[];
  didWin: boolean;
  didOpponentWin: boolean;
  tieBreakerComingTime?: Date;
  roundName: string;
}

/*
 PENDING - round has been created in the admin API but isn't visible to users yet
 CANCELLED
 VISIBLE - round is visible to users (i.e. will be published in the WDS docs), but can't yet be joined
 OPEN - round is ready to join (or leave)
 FULL - round is open, but nobody else can join
 INPLAY - the round is currently running (only applies to BRACKET rounds) and can't be joined or left
 CLOSED
 */
export type RoundStatus = 'PENDING' | 'CANCELLED' | 'VISIBLE' | 'OPEN' | 'FULL' | 'INPLAY' | 'CLOSED';

export function fillRoundFromJson(round: Round): void {
  round.isBracketRound = round.roundType === 'BRACKET';
  round.questions = round.questions || [];
  round.encryptedQuestions = round.encryptedQuestions || [];
}
