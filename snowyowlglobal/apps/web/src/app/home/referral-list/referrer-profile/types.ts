import { Subscriber } from "../types";

export interface ReferralTierDTO {
    moneyEarned: number;
    peopleReferred:number;   
    transactionDate: Date; 
}

export interface Referral3TiersDTO {
    nickname: string;
    photoUrl: string;       
    tier1: ReferralTierDTO;
    tier2: ReferralTierDTO;
    tier3: ReferralTierDTO;
    tier4: ReferralTierDTO;
}

export interface GlobalEarningsDTO {
    yearly: Referral3TiersDTO[];
    monthly: Referral3TiersDTO[];
}

export interface Referrer {
    nickname: string;
    photoUrl: string;
    moneyEarned: number;
    peopleReferred: number;
    directReferred: number;
 
}

export type onProfileBackClickHandler = (nickname?: string) => void;

export interface ReferrerProfileProperties {
    referrer: Referrer;    
    level: number;
    onProfileBackClick:  onProfileBackClickHandler;
    globalEarnings: GlobalEarningsDTO;
}

