export interface GamePlayer {
  id: string;
  gameId: string;
  subscriberId: number;
  determination: Determination;

  payoutCompleted: boolean;
  payoutPaymentId?: string; // receipt id
  payoutVenue?: string;
  rank?: number;
  countdownToElimination?: number | null; // how many "lives" a user has in the game. null=no limit,
  nextRoundId?: string; // the uuid of the next round in a game (null=at the last round or eliminated)
  lastRoundId?: string; //  the uuid of the previous round in a game (null=at the first round)
  // createDate: Date;
  payoutAwardedAmount?: number;
}

/**
 * INPLAY - actively playing the game now
 * SIDELINES - in the game, but not currently playing
 * ELIMINATED - user was eliminated during bracket play
 * AWARDED - game is over and user has been awarded payout
 * REMOVED - user unjoined the game
 * CANCELLED
 */
type Determination = 'INPLAY' | 'SIDELINES' | 'ELIMINATED' | 'AWARDED' | 'REMOVED' | 'CANCELLED';
