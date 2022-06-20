import {SubscriberQuestionAnswer} from "@snowl/base-app/model";
import {uuid} from "@snowl/base-app/util";
import {getLoggedInSubIdFromDb} from "@snowl/mock/mocks/db/subscriber.db";

export const sqas: {[id: string]: SubscriberQuestionAnswer} = {};

export function addSqaToDb(questionId: string, decryptKey: string, matchId: string): SubscriberQuestionAnswer {
  const sqa: SubscriberQuestionAnswer = {
    id: uuid(),
    determination: 'UNKNOWN',
    questionDecryptKey: decryptKey,
    questionId,
    matchId,
    selectedAnswerId: null,
    won: false,
    subscriberId: getLoggedInSubIdFromDb()
  };
  sqas[sqa.id] = sqa;

  return sqa;
}

export function getSQAFromDb(id: string): SubscriberQuestionAnswer {
  return sqas[id];
}
