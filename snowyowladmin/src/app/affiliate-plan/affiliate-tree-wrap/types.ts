export interface AffiliateTreeProperties {
    baseUrl: string;
    headers: Record<string, string>;
}

export interface AffiliateTreeEntryProperties {
    headers: Record<string, string>;
}

export interface ReferralTransaction {
    nickname: string;
    date: string;
    amount: number;
}
export interface ReferralTreeNode {
    subscriberId: number;
    nickname: string;
    transactionDate: string;
    children: ReferralTreeNode[],
    transactions: ReferralTransaction[],
    createDate: string;
    totalAmount: number;
    transactionsCount: number;
    referredPeople: number;
        
}
export interface ReferralSummary {
    nickname: string;
    parentNickName: string;
    referralTreeNodes: ReferralTreeNode[],
    moneyEarned: number;
    peopleReferred: number;    
    transactions: ReferralTransaction[],
}

export  interface AffiliateTreeHeaderProperties {
    topTitle: string;
    summary: ReferralSummary;
}


export interface AffiliateTreeDetailsProperties {
    parentNickName:string;
    topTitle: string;
    referralTreeNodes: ReferralTreeNode[]
    transactions: ReferralTransaction[]
}