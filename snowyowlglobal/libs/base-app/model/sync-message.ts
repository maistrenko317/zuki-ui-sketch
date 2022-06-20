import { GamePlayer } from '@snowl/base-app/model/game-player';
import { MatchPlayer } from '@snowl/base-app/model/match-player';
import {RoundPlayer, RoundPlayerDetermination} from '@snowl/base-app/model/round-player';
import { MatchQuestion } from '@snowl/base-app/model/match-question';
import { SubscriberQuestionAnswer } from '@snowl/base-app/model/subscriber-question-answer';
import {RoundType} from '@snowl/base-app/model/round';
import {SubscriberLives} from '@snowl/base-app/model/subscriber-lives';

interface BaseSyncMessage {
  id: string;
  messageType: SyncMessageType;
  contextualId: string;
  subscriberId: number;
  payload?: any;
  createDate: Date;
}

export interface JoinedGameSyncMessage extends BaseSyncMessage {
  messageType: 'joined_game';

  payload: {
    freeplay: boolean;
  }
}

export interface AbandonedGameSyncMessage extends BaseSyncMessage {
  messageType: 'abandoned_game';
}

export interface EliminatedSyncMessage extends BaseSyncMessage {
  messageType: 'eliminated';
}

export interface JoinedRoundSyncMessage extends BaseSyncMessage {
  messageType: 'joined_round';

  payload: { roundPlayer: RoundPlayer, freePlayerCount: number, payedPlayerCount: number, roundType: RoundType };
}

export interface AbandonedRoundSyncMessage extends BaseSyncMessage {
  messageType: 'abandoned_round';

  payload: { roundPlayer: RoundPlayer };
}

export interface UserMatchedSyncMessage extends BaseSyncMessage {
  messageType: 'user_matched';

  payload: { players: MatchPlayer[], lives: SubscriberLives[] };
}

export interface QuestionSyncMessage extends BaseSyncMessage {
  messageType: 'question';

  payload: { question: string; subscriberQuestionAnswerId: string };
}

export interface QuestionResultSyncMessage extends BaseSyncMessage {
  messageType: 'question_result';

  payload: {
    matchQuestion: MatchQuestion;
    correctAnswerId: string;
    subscriberQuestionAnswers: SubscriberQuestionAnswer[];
    lives: SubscriberLives[];
  };
}

export interface MatchResultSyncMessage extends BaseSyncMessage {
  messageType: 'match_result';

  payload: {
    subscriberId: number;
    roundId: string;
    roundType: RoundType;
    determination: RoundPlayerDetermination;
  };
}

export interface GameResultSyncMessage extends BaseSyncMessage {
  messageType: 'game_result';
  payload: { gamePlayer: GamePlayer; roundPlayers: RoundPlayer[] };
}

export type SyncMessageType =
  | 'joined_game'
  | 'abandoned_game'
  | 'joined_round'
  | 'abandoned_round'
  | 'user_matched'
  | 'question'
  | 'question_result'
  | 'match_result'
  | 'eliminated'
  | 'game_result';

export type SyncMessage =
  | JoinedGameSyncMessage
  | AbandonedGameSyncMessage
  | EliminatedSyncMessage
  | JoinedRoundSyncMessage
  | AbandonedRoundSyncMessage
  | UserMatchedSyncMessage
  | QuestionSyncMessage
  | QuestionResultSyncMessage
  | MatchResultSyncMessage
  | GameResultSyncMessage;

export function syncMessageFromJson(sync: SyncMessage): SyncMessage {
  if (sync.payload && typeof sync.payload === 'string') {
    sync.payload = JSON.parse(sync.payload);
  }
  sync.createDate = new Date(sync.createDate);

  return sync;
}
