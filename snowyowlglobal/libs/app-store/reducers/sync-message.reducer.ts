import {
  MatchPlayer,
  NormalizedGame,
  QuestionResultSyncMessage,
  Round, SubscriberLives,
  SyncMessage,
  UserMatchedSyncMessage
} from '@snowl/base-app/model';
import { decryptAES, findInArr, keyBy } from '@snowl/base-app/util';
import { Question } from '@snowl/base-app/model/question';
import { MetaReducer } from '@ngrx/store';
import { AppState } from '@snowl/app-store/reducers';
import {SyncMessageActions, SyncMessageReceivedAction, SyncMessagesReceivedAction} from '@snowl/app-store/actions';

export function syncMessagesMetaReducer(reducer: any) {
  return (state: AppState | undefined, action: SyncMessageActions) => {
    if (!state) return reducer(state, action);

    switch (action.type) {
      case SyncMessagesReceivedAction.type:
        for (const id in action.payload) {
          if (action.payload.hasOwnProperty(id)) {
            state = syncMessagesReducer(state, action.payload[id]);
          }
        }
        return state;
      case SyncMessageReceivedAction.type:
        return syncMessagesReducer(state, [action.payload]);
      default:
        return reducer(state, action);
    }
  };
}

function syncMessagesReducer(state: AppState, messages: SyncMessage[]): AppState {
  if (!messages.length) return state;

  const gameId = messages[0].contextualId;
  let game = state.games.gameEntities[gameId];
  if (!game) {
    return state; // TODO: this is a problem and should be handled somehow!
  }
  game = JSON.parse(JSON.stringify(game)) as NormalizedGame;
  game.hasParsedSyncMessages = true;

  const rounds: { [id: string]: Round } = {};
  game.rounds.forEach(round => {
    rounds[round] = JSON.parse(JSON.stringify(state.rounds.entities[round]));
  });

  let currentRound = rounds[game.currentRound || ''];

  for (const message of messages) {
    game.clientStatus = 'DEFAULT';

    const payload = message.payload;
    if (message.messageType === 'joined_game') {
      if (message.payload && message.payload.freeplay) {
        game.userJoinedFreeplay = true;
      } else {
        game.userJoinedGame = true;
        game.userJoinedFreeplay = true;
      }
    } else if (message.messageType === 'joined_round') {
      const oldRound = currentRound;
      game.currentRound = payload.roundPlayer.roundId;
      currentRound = rounds[game.currentRound!];

      if (!currentRound) {
        throw new Error('Received joined_round Sync Message, but no round exists: ' + game.currentRound);
      }

      currentRound.currentPlayerCount = message.payload.payedPlayerCount;

      if (currentRound.currentPlayerCount > game.totalPlayers) {
        game.totalPlayers = message.payload.payedPlayerCount;
      }

      if (currentRound.roundType === 'BRACKET' && game.gameStatus === 'OPEN') {
        game.playStatus = 'BRACKET';
        game.gameStatus = 'INPLAY';
      }

      currentRound.userJoinedRound = true;
      game.clientStatus = 'WAITING_FOR_MATCH';
    } else if (message.messageType === 'user_matched' && currentRound) {
      handleMatchedPlayer(message, currentRound);
      game.clientStatus = 'WAITING_FOR_QUESTION';
      // TODO: wait for question time
    } else if (message.messageType === 'question' && currentRound) {
      currentRound.encryptedQuestions.push(message);
      game.clientStatus = 'HAS_QUESTION';
    } else if (message.messageType === 'question_result' && currentRound) {
      setQuestionResult(message, currentRound);
      game.clientStatus = 'WAITING_FOR_QUESTION';
    } else if (message.messageType === 'match_result') {
      const info = payload.roundPlayer || payload;
      const round = rounds[info.roundId]!;
      round.finished = true;
      round.didWin = info.determination === 'WON';
      round.didOpponentWin = info.determination === 'LOST';

      if (round.isBracketRound) {
        game.wasSaved = info.determination === 'SAVED';
        // TODO: handle lives
        game.userEliminated = info.determination === 'LOST';
        game.eliminatedRound = round.roundSequence;
      }

      game.clientStatus = 'DEFAULT';
    } else if (message.messageType === 'abandoned_round') {
      const round = rounds[payload.roundPlayer.roundId];
      round!.userJoinedRound = false;
    } else if (message.messageType === 'game_result') {
      game.wonAmount = payload.gamePlayer.payoutAwardedAmount;
      game.gameStatus = 'CLOSED';
      game.playStatus = 'FINISHED';
    } else if (message.messageType === 'eliminated') {
      game.userEliminated = true;
      if (currentRound) {
        game.eliminatedRound = currentRound.roundSequence;
      }
    }
  }

  if (game.gameStatus === 'CANCELLED' || game.gameStatus === 'CLOSED') game.clientStatus = 'DEFAULT';

  return {
    ...state,
    games: {
      ...state.games,
      gameEntities: {
        ...state.games.gameEntities,
        [gameId]: game
      }
    },
    rounds: {
      ...state.rounds,
      entities: {
        ...state.rounds.entities,
        ...rounds
      }
    }
  };
}


function setQuestionResult(result: QuestionResultSyncMessage, round: Round): void {
  const questionId = result.payload.matchQuestion.questionId;
  let decryptedQuestion = findInArr(round.questions, 'id', questionId);
  if (!decryptedQuestion) {
    decryptedQuestion = getDecryptedQuestion(result, round);
  }
  if (!decryptedQuestion) return;

  decryptedQuestion.correctAnswerId = result.payload.correctAnswerId;
  result.payload.subscriberQuestionAnswers.forEach(answer => {
    if (answer.subscriberId === result.subscriberId) {
      decryptedQuestion!.answer = answer;
    } else {
      decryptedQuestion!.opponentAnswer = answer;
    }
  });

  handleSubscriberLives(result.subscriberId, result.payload.lives, round);
}

function getDecryptedQuestion(result: QuestionResultSyncMessage, round: Round): Question | undefined {
  const existing = findInArr(round.questions, 'id', result.payload.matchQuestion.questionId);
  if (existing) return existing;

  const subscriberQuestionAnswers = keyBy(result.payload.subscriberQuestionAnswers, 'id');
  for (const encrypted of round.encryptedQuestions) {
    const match = subscriberQuestionAnswers[encrypted.payload.subscriberQuestionAnswerId];
    if (match) {
      const questionStr = decryptAES(match.questionDecryptKey, encrypted.payload.question);
      const question = JSON.parse(questionStr) as Question;
      round.questions.push(question);
      return question;
    }
  }
}

export function handleMatchedPlayer(message: UserMatchedSyncMessage, round: Round): void {
  for (const player of message.payload.players) {
    if (player.subscriberId !== message.subscriberId) {
      round.matchedPlayer = player;
      break;
    }
  }

  handleSubscriberLives(message.subscriberId, message.payload.lives, round);
}

export function handleSubscriberLives(mySubscriberId: number, allLives: SubscriberLives[], round: Round): void {
  if (!allLives) return; // Backwards compatibility
  for (const lives of allLives) {
    if (lives.subscriberId === mySubscriberId) {
      round.myLives = lives.remainingLives;
      round.myTotalLives = lives.totalLives;
    } else {
      round.opponentLives = lives.remainingLives;
      round.opponentTotalLives = lives.totalLives;
    }
  }
}
