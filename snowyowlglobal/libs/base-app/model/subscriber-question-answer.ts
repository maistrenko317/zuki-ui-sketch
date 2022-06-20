export interface SubscriberQuestionAnswer {
  id: string;
  // gameId: string;
  // roundId: string;
  matchId: string;
  questionId: string;
  // matchQuestionId: string;
  subscriberId: number;
  selectedAnswerId: string | null; // Null means not yet answered
  questionDecryptKey: string;
  // durationMilliseconds: number;
  determination: Determination;
  won: boolean;

  // createDate: Date;
  // questionPresentedTimestamp: Date;

  // get isCorrect(): boolean {
  //   const correct = ['WON_TIME', 'WON_CORRECT', 'WON_TIMEOUT', 'LOST_TIME'];
  //   return correct.indexOf(this.determination) !== -1;
  // }
  //
  // get didTie(): boolean {
  //   const tie = ['LOST_ALL_TIMEOUT'];
  //   return tie.indexOf(this.determination) !== -1;
  // }
}

/*
 UNKNOWN-not yet scored,
 WON_TIME-both answered correct, you were faster,
 LOST_TIME-both answered correct, you were slower,
 WON_CORRECT-you got it correct, opponent got it incorrect,
 LOST_INCORRECT-you got it incorrect, opponent got it correct,
 WON_TIMEOUT-you got it correct, opponent timed out,
 LOST_TIMEOUT-you timed out, opponent got it correct,
 LOST_ALL_TIMEOUT-both timed out
 */
type Determination =
  | 'UNKNOWN'
  | 'WON_TIME'
  | 'LOST_TIME'
  | 'WON_CORRECT'
  | 'LOST_INCORRECT'
  | 'WON_TIMEOUT'
  | 'LOST_TIMEOUT'
  | 'LOST_ALL_TIMEOUT'; // TODO: what does unknown mean?
