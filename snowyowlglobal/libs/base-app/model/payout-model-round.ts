export interface PayoutModelRound {
  sortOrder: number;
  payoutModelId: number;
  description: string;
  startingPlayerCount: number;
  eliminatedPlayerCount: number;
  eliminatedPayoutAmount: number;
  type: 'CASH';
  category: 'PHYSICAL' | 'VIRTUAL';
}
