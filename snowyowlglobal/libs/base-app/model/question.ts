import { Answer } from './answer';
import { SubscriberQuestionAnswer } from './subscriber-question-answer';

export interface Question {
  id: string;
  // difficulty: number; // 0 is easy 10 is hard
  // source?: string; // where the question came from
  // languageCodes: string[];
  // forbiddenCountryCodes: string[];
  questionText: any;
  // mediaUrl: string;
  // mediaType: string;
  // usageCount: number;
  // questionCategoryUuids: string[];
  // createDate: Date;
  // expirationDate: Date;
  answers: Answer[];
  type: 'REGULAR' | 'TIEBREAKER';

  // These fields are added by Aidan
  answer?: SubscriberQuestionAnswer;
  opponentAnswer?: SubscriberQuestionAnswer;
  correctAnswerId?: string;
  questionPresentedTimestamp?: Date;
  subscriberQuestionAnswerId?: string;
}
