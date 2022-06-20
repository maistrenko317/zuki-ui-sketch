import {
  MatchQuestion,
  RoundPlayerDetermination,
  SubscriberQuestionAnswer,
  SyncMessage,
  SyncMessageType
} from "@snowl/base-app/model";
import {uuid} from "@snowl/base-app/util";
import {getLoggedInSubIdFromDb} from "@snowl/mock/mocks/db/subscriber.db";
import {MOCK_SOCKET} from "@snowl/mock/mock.socket";
import {getPublicProfileFromSubscriber} from "@snowl/mock/mocks/mock-util";
import {MatchDb} from "@snowl/mock/mocks/db/match.db";

const messages: { [gameId: string]: SyncMessage[] } = {};

export function getSyncMessagesForGameFromDb(id: string) {
  if (!messages[id])
    messages[id] = [];

  return messages[id];
}

function sendSyncMessage(type: SyncMessageType, gameId: string, payload?: any): void {
  const existingMessages = getSyncMessagesForGameFromDb(gameId);
  let subId: number;

  try {
    subId = getLoggedInSubIdFromDb();
  } catch (e) {
    if (existingMessages.length) {
      subId = existingMessages[0].subscriberId;
    } else {
      throw e;
    }
  }

  const message = {
    id: uuid(),
    messageType: type,
    contextualId: gameId,
    subscriberId: subId,
    payload: payload,
    createDate: new Date()
  } as SyncMessage;
  existingMessages.push(message);
  MOCK_SOCKET.sendToClient('sync_message', message);
}


export function sendJoinGameSyncMessageDb(id: string): void {
  sendSyncMessage('joined_game', id);
}

export function sendJoinRoundSyncMessageDb(gameId: string, roundId: string): void {
  sendSyncMessage('joined_round', gameId, {
    roundPlayer: {
      gameId,
      roundId,
      createDate: new Date()
    }
  });
}

export function sendUserMatchedSyncMessage(gameId: string, roundId: string, match: MatchDb): void {
  sendSyncMessage('user_matched', gameId, {
    players: [{
      gameId, roundId, subscriberId: match.sub1.subscriberId, publicProfile: getPublicProfileFromSubscriber(match.sub1)
    }, {
      gameId, roundId, subscriberId: match.sub2.subscriberId, publicProfile: getPublicProfileFromSubscriber(match.sub2)
    }]
  })
}

export function sendQuestionSyncMessage(gameId: string, question: string, subscriberQuestionAnswerId: string): void {
  sendSyncMessage('question', gameId, {question, subscriberQuestionAnswerId})
}

export function sendQuestionResultSyncMessage(gameId: string, matchQuestion: MatchQuestion, correctAnswerId: string, subscriberQuestionAnswers: SubscriberQuestionAnswer[]): void {
  sendSyncMessage('question_result', gameId, {matchQuestion, correctAnswerId, subscriberQuestionAnswers});
}

export function sendMatchResultSyncMessage(gameId: string, subscriberId: number, roundId: string, determination: RoundPlayerDetermination): void {
  sendSyncMessage('match_result', gameId, {subscriberId, roundId, determination});
}
