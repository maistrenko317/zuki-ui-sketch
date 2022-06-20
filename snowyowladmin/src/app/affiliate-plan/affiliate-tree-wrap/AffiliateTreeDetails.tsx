import React, { useContext, useEffect, useState } from 'react';
import { AffiliateTreeDetailsProperties, ReferralTransaction, ReferralTreeNode } from './types';
import { styles } from './AffiliateTree.styles';
import { AffiliateTreeContext } from './AffiliateTreeContext';
import { formatToCurrency } from './utils';

const ChildAffiliateParagraph: React.FC<{label: string, value: any}> = (props: {label: string, value: any}) => (
    <p style={styles.childParagraph}><span style={styles.detailLabel}>{props.label}:</span>&nbsp;<span style={styles.detailText}>{props.value}</span></p>
)

const length =  <T,>(x?: T[]) => !x ? 0 : x.length;

const ChildAffiliate: React.FC<{referral: ReferralTreeNode}> = (props: {referral: ReferralTreeNode}) => {
    const context = useContext(AffiliateTreeContext);
    const {rootUrl, url, setUrl} = context!;
    const referral = props.referral;
    const onClick = (event:any) => {
        const subscriberId = event.currentTarget.getAttribute("data-id");
        setUrl([...url, `${rootUrl}/referral/summary/${subscriberId}`])
    }
    return (
        <div style={styles.child} onClick={onClick} data-id={referral.subscriberId}>
            {referral.transactionDate ? (<p style={styles.transactionDate}>{referral.transactionDate.toString()}</p>) : <></>}
            <ChildAffiliateParagraph label="Affiliate"  value={referral.nickname}/>
            <ChildAffiliateParagraph label="Earned"  value={formatToCurrency(referral.totalAmount)}/>
            <ChildAffiliateParagraph label="Referred"  value={referral.referredPeople}/>
        </div>
    )
}

const ChildTransaction: React.FC<{transaction: ReferralTransaction, parentNickName:string}> = (props: {transaction: ReferralTransaction, parentNickName:string}) => {
    return (
        <div style={styles.transaction}>
            <span style={{float: "left"}}>Played a game and earned {props.parentNickName}</span>&nbsp;<span style={{float: "right", color: "#FFD700"}}>${formatToCurrency(props.transaction.amount)}</span>
        </div>
    )    
}

export const AffiliateTreeDetails: React.FC<AffiliateTreeDetailsProperties> = (props: AffiliateTreeDetailsProperties) => {
    const referralTreeNodes = props.referralTreeNodes;
    const transactions = props.transactions;
    const topTitle = props.topTitle;

    return (
        <>
            <div style={styles.details}>
            {
                transactions.map((transaction:ReferralTransaction, key: number) => <ChildTransaction  parentNickName={props.parentNickName} key={key} transaction={transaction} />)
            }
            </div>        
            <div style={styles.details}>
            {
                referralTreeNodes
                    .sort((a: ReferralTreeNode, b: ReferralTreeNode) => (b.referredPeople + b.totalAmount)-(a.referredPeople + a.totalAmount))
                    .map((referral:ReferralTreeNode, key: number) => <ChildAffiliate key={key} referral={referral} />)
            }
            </div>
        </>
    )
}
