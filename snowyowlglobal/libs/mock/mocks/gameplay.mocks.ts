import {MockApi, Mocks} from "@snowl/mock/mocks/mocks";
import {
  Game,
  JoinedRoundSyncMessage, MatchQuestion,
  Question,
  ServerGame,
  ServerRound,
  ShoutResponse,
  SubscriberQuestionAnswer
} from "@snowl/base-app/model";
import {getGameFromDb, increaseGamePlayerCountDb} from "@snowl/mock/mocks/db/game.db";
import {
  getSyncMessagesForGameFromDb,
  sendJoinGameSyncMessageDb,
  sendJoinRoundSyncMessageDb,
  sendMatchResultSyncMessage,
  sendQuestionResultSyncMessage,
  sendQuestionSyncMessage,
  sendUserMatchedSyncMessage
} from "@snowl/mock/mocks/db/sync-message.db";
import {MockError} from "@snowl/mock/mock-error";
import {getNewBotFromDb, getLoggedInSubFromDb, getLoggedInSubIdFromDb} from "@snowl/mock/mocks/db/subscriber.db";
import {randomInt, uuid} from "@snowl/base-app/util";
import {generateQuestion, getQuestionFromDb, getRandomQuestionForUser} from "@snowl/mock/mocks/db/question.db";
import {encryptAES} from "@snowl/mock/mocks/mock-util";
import {DecryptKeyResponse} from "@snowl/base-app/shared";
import {addSqaToDb, getSQAFromDb} from "@snowl/mock/mocks/db/subscriber-question-answer.db";
import {addMatchToDb, getMatchFromDb, MatchDb} from "@snowl/mock/mocks/db/match.db";
import {MOCK_SOCKET} from "@snowl/mock/mock.socket";

const pendingQuestions: {[sqaId: string]: any} = {};
export class GameplayMocks extends Mocks {

  @MockApi(/snowl\/game\/join/)
  mockJoinGame(body: {gameId: string}): ShoutResponse {
    increaseGamePlayerCountDb(body.gameId);
    sendJoinGameSyncMessageDb(body.gameId);

    return {success: true};
  }

  @MockApi(/game\/beginPoolPlay/)
  mockPoolPlay(body: {gameId: string}): ShoutResponse {
    const game = getGameFromDb(body.gameId);
    const messages = getSyncMessagesForGameFromDb(body.gameId);
    const joinedRounds = messages.filter((message): message is JoinedRoundSyncMessage => message.messageType === 'joined_round')
      .map(message => message.payload.roundPlayer.roundId);

    for (const round of game.rounds) {
      if (round.roundType === 'POOL' && !joinedRounds.includes(round.id)) {
          this.playRound(game, round);
          return {success: true};
      }
    }

    throw new MockError('noOpenRounds')
  }

  @MockApi(/question\/getDecryptKey/, {synchronous: true})
  mockGetDecryptKey(body: {subscriberQuestionAnswerId: string}): DecryptKeyResponse {
    const sqa = getSQAFromDb(body.subscriberQuestionAnswerId);

    return {
      success: true,
      decryptKey: sqa.questionDecryptKey,
      questionPresentedTimestamp: new Date()
    }
  }

  @MockApi(/question\/submitAnswer/)
  mockSubmitAnswer(body: {subscriberQuestionAnswerId: string, selectedAnswerId: string}): ShoutResponse {
    const sqa = getSQAFromDb(body.subscriberQuestionAnswerId);
    const question = getQuestionFromDb(sqa.questionId);
    sqa.selectedAnswerId = body.selectedAnswerId;

    if (pendingQuestions[body.subscriberQuestionAnswerId]) {
      clearTimeout(pendingQuestions[body.subscriberQuestionAnswerId]);
    }

    setTimeout(() => {
      this.sendQuestionResult(sqa, question);
    }, 1000);

    return {
      success: true
    }
  }

  private playRound(game: ServerGame, round: ServerRound): void {
    sendJoinRoundSyncMessageDb(game.id, round.id);
    const player1 = getLoggedInSubFromDb();
    const player2 = getNewBotFromDb();
    setTimeout(() => {
      const match = addMatchToDb(player1, player2, game.id);

      sendUserMatchedSyncMessage(game.id, round.id, match);

      setTimeout(() => {
        this.sendQuestion(game, match, round);
      }, 1000)
    }, 1000)
  }

  private sendQuestion(game: ServerGame, match: MatchDb, round: ServerRound, tiebreaker = false): void {
    const question = getRandomQuestionForUser(tiebreaker);
    const encrypted = encryptAES(JSON.stringify(question));

    const sqa = addSqaToDb(question.id, encrypted.decryptKey, match.id);

    pendingQuestions[sqa.id] = setTimeout(() => {
      this.sendQuestionResult(sqa, question);
    }, round.playerMaximumDurationSeconds * 1000);;

    sendQuestionSyncMessage(game.id, encrypted.result, sqa.id);
  }

  private sendQuestionResult(sqa: SubscriberQuestionAnswer, question: Question): void {
    const matchQuestion: MatchQuestion = {
      questionId: question.id
    };

    const correctAnswer = question.answers.find((answer) => !!answer.correct)!;
    const match = getMatchFromDb(sqa.matchId);

    const robotAnswerId = question.answers[randomInt(0, question.answers.length - 1)].id;

    const robotCorrect = robotAnswerId === correctAnswer.id;
    const userCorrect = sqa.selectedAnswerId === correctAnswer.id;

    const userWon = !!sqa.selectedAnswerId && userCorrect;
    const robotWon = robotCorrect && !userWon;
    const sqa2: SubscriberQuestionAnswer = {
      ...sqa,
      subscriberId: match.sub2.subscriberId,
      id: uuid(),
      selectedAnswerId: robotAnswerId
    };

    sqa.won = userWon;
    sqa2.won = robotWon;

    if (userCorrect && robotCorrect) {
      sqa.determination = 'WON_TIME';
      sqa2.determination = 'LOST_TIME';
    } else if (userWon) {
      sqa.determination = 'WON_CORRECT';
      sqa2.determination = 'LOST_INCORRECT';
    } else if (robotWon) {
      sqa.determination = 'LOST_INCORRECT';
      sqa2.determination = 'WON_CORRECT';
    } else {
      sqa.determination = 'LOST_INCORRECT';
      sqa2.determination = 'LOST_INCORRECT';
    }

    sendQuestionResultSyncMessage(match.gameId, matchQuestion, correctAnswer.id, [sqa, sqa2]);

    this.sendNextQuestionOrMatchResult(getGameFromDb(match.gameId), match);
  }

  private sendNextQuestionOrMatchResult(game: ServerGame, match: MatchDb): void {
    const messages = getSyncMessagesForGameFromDb(game.id);

    let user1CorrectCount = 0;
    let user2CorrectCount = 0;
    const user1Id = match.sub1.subscriberId;
    const user2Id = match.sub2.subscriberId;

    let numQuestions = 0;

    let round: ServerRound = game.rounds[0];

    messages.forEach(message => {
      if (message.messageType === 'joined_round') {
        const roundId = message.payload.roundPlayer.roundId;
        round = game.rounds.find(r => r.id === roundId) || round;
      }

      if (message.messageType === "question_result") {
        numQuestions++;

        const answers = message.payload.subscriberQuestionAnswers;
        if (answers[0].subscriberId === user1Id) {
          user1CorrectCount += answers[0].won ? 1 : 0;
          user2CorrectCount += answers[1].won ? 1 : 0;
        }
        else {
          user2CorrectCount += answers[0].won ? 1 : 0;
          user1CorrectCount += answers[1].won ? 1 : 0;
        }
      }
    });

    const maxQuestionCountBeforeGivingUp = round.maximumActivityCount;
    const numQuestionsToWin = round.minimumActivityToWinCount;

    let finished: boolean;
    const hasWinner = user1CorrectCount >= numQuestionsToWin || user2CorrectCount >= numQuestionsToWin;
    const isTied = user1CorrectCount === user2CorrectCount;
    let showTiebreaker = false;

    if (hasWinner) {
      finished = true;
    } else if (isTied && numQuestions === maxQuestionCountBeforeGivingUp) {
      // There is a tie breaker question.
      finished = false;
      showTiebreaker = true;
    } else {
      finished = numQuestions >= maxQuestionCountBeforeGivingUp;
    }

    if (finished) {
      const didUser1Win = user1CorrectCount > user2CorrectCount;
      const didUser2Win = user2CorrectCount > user1CorrectCount;
      const subId = getLoggedInSubIdFromDb();
      const won = subId === user1Id ? didUser1Win : didUser2Win;

      sendMatchResultSyncMessage(game.id, subId, round.id, won ? 'WON' : 'LOST');
    } else {
      setTimeout(() => {
        this.sendQuestion(game, match, round, isTied);
      }, showTiebreaker ? 10000 : 3000);
    }

    if (showTiebreaker) {
      MOCK_SOCKET.sendToClient('tiebreaker_coming', {tieBreakerComingInMs: 10000});
    }

  }
}

