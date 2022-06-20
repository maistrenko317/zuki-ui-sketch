import React, { MouseEventHandler } from 'react';
import { onReferralRowClickHandler, Referral3TierDTO } from "./types";
import { referralPhotoUrl } from "../utils";



const ReferralAvatar: React.FC<{photoUrl?: string}> = ({photoUrl}) => {
    const actualUrl = referralPhotoUrl(photoUrl);
        return (<img src={actualUrl} className="referral-avatar" />
    )
}


export const ReferralTableBody: React.FC<{referral3TierDTOList: Referral3TierDTO[], onReferralRowClick: onReferralRowClickHandler}> = ({referral3TierDTOList, onReferralRowClick}) => {
    const onRowClick: React.MouseEventHandler<HTMLTableRowElement> = (event: any) =>{
        event.stopPropagation();
        onReferralRowClick(event.currentTarget!.getAttribute("data-nickname"));
    }
    return (
        <tbody>
            {referral3TierDTOList.map((dto : Referral3TierDTO) =>(
                <tr key={dto.nickname} data-nickname={dto.nickname} onClick={onRowClick}>
                    <td className="nickname-cell"><ReferralAvatar photoUrl={dto.photoUrl} /><p className="referral-nickname">{dto.nickname}</p></td>
                    <td className="number-cell">{dto.tier1.moneyEarned.toFixed(2)}</td>
                    <td className="number-cell">{dto.tier1.peopleReferred}</td>
                    <td className="number-cell">{dto.tier2.moneyEarned.toFixed(2)}</td>
                    <td className="number-cell">{dto.tier2.peopleReferred}</td>
                    <td className="number-cell">{dto.tier3.moneyEarned.toFixed(2)}</td>
                    <td className="number-cell">{dto.tier3.peopleReferred}</td>
                </tr>
            ))}   
        </tbody>
    );
}