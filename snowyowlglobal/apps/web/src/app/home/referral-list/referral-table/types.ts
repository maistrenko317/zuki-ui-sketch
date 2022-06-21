import { ParsedReferredPerson } from "@snowl/base-app/home";
import { Subscriber } from "../types";

export interface ReferralTierDTO {
    moneyEarned: number;
    peopleReferred: number;
}

export interface Referral3TierDTO {
    nickname: string;
    photoUrl?: string;
    tier1: ReferralTierDTO;
    tier2: ReferralTierDTO;
    tier3: ReferralTierDTO;
}

export type onReferralRowClickHandler = (nickName: string) => void;

export type onBreadcrumClickHandler = (level: number) => void;

export type onReferralBackClickHandler = () => void;

export interface ReferralTransactionDTO {
    nickname: string;
    date: Date;
    amount: number;
}
export interface ReferralTableProperties {
    transactions: ReferralTransactionDTO[];
    person?: ParsedReferredPerson;
    referral3TierDTOList: Referral3TierDTO[];
    onReferralRowClick: onReferralRowClickHandler;
    onBreadcrumClick: onBreadcrumClickHandler;
    nicknameStack: string[];
}

export interface ReferrerEventData {
    subscriber: Subscriber;
    level: number;
    onReferralBackClick: onReferralBackClickHandler;
}

export interface ReferralTableHeaderProperties {
    nicknameStack: string[];
    onBreadcrumClick: onBreadcrumClickHandler;
}

export interface BreadcrumDialogProperties {
    nicknameStack: string[],
    show:boolean, onRequestClose: ()=>void;
    onBreadcrumClick: onBreadcrumClickHandler;
}


export interface TransactionsListProperties {
    transactions: ReferralTransactionDTO[]
}