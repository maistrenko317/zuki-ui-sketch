import React, { useRef } from 'react';
import { TransactionsListProperties } from './types';
import { styles } from './TransactionsList.style';
import { useStyle } from 'apps/web/src/react-hooks';
export const TransactionsList: React.FC<TransactionsListProperties> = ({transactions}) => {
    
    const ref = useRef(null)
    useStyle(styles, ref, transactions);

    return (
        <span ref={ref}>
            <ul >
                {transactions.map(
                    transaction => (
                        <li key={transaction.nickname}>
                            <b>{transaction.nickname}</b> earned <span className="textAccent">{transaction.amount.toFixed(2)}</span> for you.
                        </li>
                    )
                )} 
            </ul>
        </span>
    )  
}