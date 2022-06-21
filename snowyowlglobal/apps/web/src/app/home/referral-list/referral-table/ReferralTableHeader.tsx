import React, { useEffect, useRef, useState } from 'react';
import { MoneyIcon } from '../icons/MoneyIcon';
import { ReferralIcon } from '../icons/ReferralIcon';
import { FolderTreeIcon } from '../icons/FolderTreeIcon';
import { ReferralTableHeaderProperties } from './types';
import { BreadcrumDialog } from './BreadcrumDialog';

export const ReferralTableHeader: React.FC<ReferralTableHeaderProperties> = ({nicknameStack, onBreadcrumClick}) => {
    const [show, setShow] = useState(false);    
    const onFolderTreeIconClick = () => setShow(true);
    const onBreadCrumDialogRequestClose = () => setShow(false);
    return (
        <thead>
            <tr>
                <th>
                    <span onClick={onFolderTreeIconClick}><FolderTreeIcon /></span>
                    <BreadcrumDialog nicknameStack={nicknameStack} show={show} onRequestClose={onBreadCrumDialogRequestClose} onBreadcrumClick={onBreadcrumClick}/>
                </th>
                <th className="tier-header" colSpan={2}>Tier 1</th>
                <th className="tier-header" colSpan={2}>Tier 2</th>
                <th className="tier-header" colSpan={2}>Tier 3</th>
            </tr>                       
            <tr>
                <th>&nbsp;</th>
                <th className="number-cell"><MoneyIcon /></th>
                <th className="number-cell"><ReferralIcon /></th>                        
                <th className="number-cell"><MoneyIcon /></th>
                <th className="number-cell"><ReferralIcon /></th>
                <th className="number-cell"><MoneyIcon /></th>
                <th className="number-cell"><ReferralIcon /></th>                        
            </tr>                    
        </thead>   
    ) 
}