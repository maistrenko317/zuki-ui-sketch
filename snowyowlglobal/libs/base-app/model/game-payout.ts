import {PayoutLevel, PayoutModel, PayoutModelRound} from './';

export interface GamePayoutLevel {
  numPlayers: number;
  payoutTable: PayoutModelRound[];
}

export interface GamePayouts {
  stepPayouts: GamePayoutLevel[];
  actualPayout?: GamePayoutLevel;
  maxPayout?: GamePayoutLevel;
}
