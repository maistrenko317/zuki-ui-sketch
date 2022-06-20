import React, { useEffect, useRef, useState } from 'react';

import { BreadcrumDialogProperties, onBreadcrumClickHandler, ReferralTableHeaderProperties } from './types';
import { stylesheet } from './BreadcrumDialog.style';
import { useStyle } from 'apps/web/src/react-hooks';

const BreadcrumString: React.FC<{nicknameStack: string[], onBreadcrumClick: onBreadcrumClickHandler}> = ({nicknameStack, onBreadcrumClick}) =>  {
    const lastLevel = nicknameStack.length - 1;
    const onLabelClick = (event: any) => {        
        const level = parseInt(event.target.getAttribute("data-level"));
        if(level < nicknameStack.length - 1 && nicknameStack.length > 1) {
            onBreadcrumClick(level);
        }
    } 
    return (
        <section className="breadcrum-string">
            {
                nicknameStack.map(
                    (nickname: string, index: number, array: string[]) => {
                        const className = lastLevel > 0 && index < lastLevel ? "clickable" : "non-clickable"
                        return (
                            <label className={className}
                                onClick={onLabelClick}
                                data-level={index}
                                key={index}>
                                    {nickname}{index == nicknameStack.length-1 ? <>&nbsp;</> : <span>➜</span>}
                            </label>
                        )
                    }
                )
            }
        </section>
    );
}

export const BreadcrumDialog: React.FC<BreadcrumDialogProperties> = ({nicknameStack, show, onRequestClose, onBreadcrumClick}) => {
    const dialogRef = useRef(null);
    useStyle(stylesheet, dialogRef)

    const [hasEvents, setHasEvents] = useState(false);
    
    useEffect(()=>{
        if(dialogRef) {
            const current = (dialogRef.current! as any);

            if(show) {

                if(!hasEvents) {
                    current.addEventListener('close', (_event:any) => onRequestClose());
                    setHasEvents(true);
                }

                current.showModal()
            } else {
                onRequestClose()
            }
        }
    },[show])

    return (
        <dialog ref={dialogRef} id="favDialog">
            <form method="dialog">
                <BreadcrumString nicknameStack={nicknameStack} onBreadcrumClick={onBreadcrumClick}/>
                <button id="confirmBtn" value="default">Close</button>
            </form>
        </dialog>        
    )
}