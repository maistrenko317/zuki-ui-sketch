import React, { useRef } from 'react';
import { MoneyIcon } from '../icons/MoneyIcon';
import { ReferralIcon } from '../icons/ReferralIcon';
import { BackIcon } from '../icons/BackIcon';
import { referralPhotoUrl, useLocalStorage } from '../utils';
import { stylesheet } from './ReferrerProfile.style';
import { Referral3TiersDTO, ReferrerProfileProperties } from './types';
import { useStyle } from 'apps/web/src/react-hooks';
import { yearMonth } from 'apps/web/src/react-utils';

const EarningsTableRow: React.FC<{period: string | number, amount: number}> = ({period, amount}) => (
    <tr><td>{period}</td> <td  style={{textAlign: "right"}}> {amount.toFixed(2)}</td></tr>
)

const MonthlyEarning: React.FC<{dto: Referral3TiersDTO}> = ({dto}) => (
    <EarningsTableRow period={yearMonth(dto.tier1.transactionDate)} amount={dto.tier1.moneyEarned} />
)

const YearlyEarning: React.FC<{dto: Referral3TiersDTO}> = ({dto}) => (    
    <EarningsTableRow period={dto.tier1.transactionDate.getFullYear()} amount={dto.tier1.moneyEarned} />
);

const MonthlyEarnings: React.FC<{dtos: Referral3TiersDTO[]}> = ({dtos}) => (
    <table>
        <thead><tr><td colSpan={2}>Monthly Earnings</td></tr></thead>
        <tbody>
            {dtos.map((dto:Referral3TiersDTO, index:number) => <MonthlyEarning key={index} dto={dto} />)} 
        </tbody>
    </table>
)

const YearlyEarnings: React.FC<{dtos: Referral3TiersDTO[]}> = ({dtos}) => (
    <table>
        <thead><tr><td colSpan={2}>Yearly Earnings</td></tr></thead>
        <tbody>
            {dtos.map((dto:Referral3TiersDTO, index:number) => <YearlyEarning key={index} dto={dto} />)} 
        </tbody>
    </table>
)

export const ReferrerProfile: React.FC<ReferrerProfileProperties> = ({globalEarnings, referrer, level, onProfileBackClick}) => {
    const spanRef = useRef(null);
    const refu = useLocalStorage("refu");
    const photoUrl = referralPhotoUrl(referrer.photoUrl);
    const onBackLick = ()=> onProfileBackClick(referrer.nickname);
    useStyle(stylesheet, spanRef, referrer)    ;

    return (
        <article ref={spanRef}>
            <header>
                <span className="header-text">Your referral link is <a target="_blank" className="link" href={refu}>{refu}</a></span>
                <svg aria-labelledby="svg-inline--fa-title-1A7Oja1MP91l" data-prefix="fas" data-icon="copy" className="info svg-inline--fa fa-copy fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><title id="svg-inline--fa-title-1A7Oja1MP91l">copy to clipboard</title><path fill="currentColor" d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"></path></svg>                
            </header>

            <main>
                <section className="amounts">
                    <section className="amount">
                        <div>        
                            <span className="label"><MoneyIcon />&nbsp;Money Earned</span>
                            <span className="fact">{referrer.moneyEarned.toFixed(2)} USD</span>        
                        </div>
                    </section> 

                    <section className="title">
                        <img className="avatar" src={photoUrl} />
                        <p>{referrer.nickname}</p>
                        {level > 0 ? <span onClick={onBackLick}><BackIcon /></span> : <></>}
                    </section>

                    <section className="amount">
                        <div>
                            <span className="label"><ReferralIcon />&nbsp;People Referred</span>
                            <span className="fact">{referrer.peopleReferred} people</span>
                        </div>
                    </section>                                       
                </section>

                <section>
                    <table className="earnings-report">
                        <tbody>
                            <td className="earnings-column">
                                <MonthlyEarnings dtos={globalEarnings.monthly.sort((a,b) => a.tier1.transactionDate.valueOf() - b.tier1.transactionDate.valueOf())} />
                            </td>
                            <td className="earnings-column">
                                <YearlyEarnings dtos={globalEarnings.yearly.sort((a,b) => a.tier1.transactionDate.valueOf() - b.tier1.transactionDate.valueOf())} />
                            </td>                            
                        </tbody>
                    </table>                                        
                </section>
            </main>
            
        </article>
    )
}