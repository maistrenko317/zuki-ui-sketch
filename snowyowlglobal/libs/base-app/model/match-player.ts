import { PublicProfile } from './public-profile';

export interface MatchPlayer {
  id: string;
  gameId: string;
  roundId: string;
  matchId: string;
  subscriberId: number;
  // determination: Determination;

  publicProfile?: PublicProfile;
}
type Determination = 'UNKNOWN' | 'WON' | 'LOST' | 'CANCELLED';
