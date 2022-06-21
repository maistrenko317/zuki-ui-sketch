import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { styles } from './AffiliateTree.styles';
import { AffiliateTreeContext } from './AffiliateTreeContext';
import { AffiliateTreeDetails } from './AffiliateTreeDetails';
import { AffiliateTreeHeader } from './AffiliateTreeHeader';
import { AffiliateTreeEntryProperties, AffiliateTreeProperties, ReferralSummary } from './types';
import { useFetch } from './utils';

const AffiliateTreeSuccess: React.FC<{summary: ReferralSummary, topTitle: string, parentNickName: string}> = (properties) => (
    <div style={styles.affiliateTree}>
        <AffiliateTreeHeader summary={properties.summary} topTitle={properties.topTitle}/>
        <AffiliateTreeDetails parentNickName={properties.parentNickName} topTitle={properties.topTitle} referralTreeNodes={properties.summary.referralTreeNodes} transactions={properties.summary.transactions}/>
    </div>
)

const AffiliateTreeError: React.FC<{error: any}> = (properties) => (
    <div style={styles.affiliateTree}>
        <h1>{JSON.stringify(properties.error)}</h1>
    </div>
)

const AffiliateTreeEntry: React.FC<AffiliateTreeEntryProperties> = (props: AffiliateTreeEntryProperties) => {
    const {url} = useContext(AffiliateTreeContext) || {url: ""};
    const { serverError, response } = useFetch<ReferralSummary>(
        url[url.length-1],
        props.headers,
        { nickname: "", referralTreeNodes: [], moneyEarned: 0, peopleReferred: 0, transactions: [], parentNickName: "" }
    );    
    

    return ( serverError ? 
            (<AffiliateTreeError error={serverError}/>) : 
            (<AffiliateTreeSuccess summary={response} parentNickName={response.parentNickName} topTitle={response.nickname ? response.nickname : "All Affiliates"}/>)
        );
    
}

export const AffiliateTree: React.FC<AffiliateTreeProperties> = (props: AffiliateTreeProperties) => {
    const rootUrl=props.baseUrl;
    const [url, setUrl] = useState<string[]>([`${rootUrl}/referral/summary`]);
    
    return (
        <AffiliateTreeContext.Provider value={{ url, rootUrl, setUrl }}>
            <AffiliateTreeEntry headers={props.headers}/>
        </AffiliateTreeContext.Provider>
    )
    
}