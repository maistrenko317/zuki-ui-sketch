export interface MatchQuestion {
  // id: string;
  // gameId: string;
  // roundId: string;
  // matchId: string;
  questionId: string;
  // matchQuestionStatus: MatchQuestionStatus;
  // wonSubscriberId: number | null; // Will be null until there is a winner
  // determination: Determination;

  // createDate: Date;
  // completedDate: Date;
}

type MatchQuestionStatus = 'NEW' | 'OPEN' | 'WAITING_FOR_NEXT_QUESTION' | 'PROCESSING' | 'CLOSED' | 'CANCELLED';
type Determination = 'WINNER' | 'NO_WINNER' | 'TIE' | 'UNKNOWN'; // TODO: what does unknown mean?
