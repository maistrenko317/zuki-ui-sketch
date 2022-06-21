export interface RoundPlayer {
  id: string;
  gameId: string;
  roundId: string;
  subscriberId: number;
  determination: RoundPlayerDetermination;
  rank?: number;
  createDate: Date;
}

export type RoundPlayerDetermination = 'WON' | 'LOST' | 'SAVED' | 'TIMEDOUT' | 'ABANDONED' | 'UNKNKOWN' | 'CANCELLED';
