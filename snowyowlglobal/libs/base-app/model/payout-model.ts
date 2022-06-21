import {PayoutModelRound} from "./payout-model-round";

export interface PayoutModel {
  payoutModelId: number;
  name: string;
  basePlayerCount: number;
  entranceFeeAmount: number;
  active: boolean;
  deactivationReason?: string;
  creatorId: number;
  deactivatorId?: number;
  createDate: Date;
  deactivatedDate?: Date;

  payoutModelRounds: PayoutModelRound[];
}
