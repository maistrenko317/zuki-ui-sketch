import React, { useRef } from "react";
import { ReferralTableProperties } from "./types";
import { stylesheet } from "./ReferralTable.style";
import { ReferralTableBody } from './ReferralTableBody';
import { ReferralTableHeader } from './ReferralTableHeader';
import { TransactionsList } from './TransactionsList';
import { useStyle } from "apps/web/src/react-hooks";


export const ReferralTable: React.FC<ReferralTableProperties> = ({transactions, referral3TierDTOList, onReferralRowClick, nicknameStack, onBreadcrumClick}) => {
    const spanRef = useRef(null);
    useStyle(stylesheet, spanRef, referral3TierDTOList)
    return (        
        <span ref={spanRef}>
            <table className="flex-table">
                <ReferralTableHeader nicknameStack={nicknameStack} onBreadcrumClick = {onBreadcrumClick}/>
                <ReferralTableBody referral3TierDTOList={referral3TierDTOList} onReferralRowClick={onReferralRowClick}/>
            </table> 
            <TransactionsList transactions={transactions} />
        </span>
    );
}
