import { HttpService, ShoutResponse } from 'app/shared/services/http.service';
import { Injectable } from '@angular/core';
import { Category } from 'app/model/category';

import { VxDialog } from 'vx-components';
import {Util} from '../../util';
import {AffiliatePlan, TextDocument} from '../../model/affiliate-plan';
import {from, Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import axios from "axios";
import {environment} from 'environments/environment';
import { HttpHeaders } from '@angular/common/http';
import * as uuid from 'uuid/v4';

/* (Rafael Solano 2022-04-21) Temporary Patch */
import { AWSService } from './aws.servise';
const SHOUTTRIVIA_AFFILIATE_PLAN="shouttrivia/affiliate-plan.json"
/* */

@Injectable()
export class AffiliateService {

    
    constructor(private httpService: HttpService, private dialog: VxDialog) {
    }

    /* (Rafael Solano 2022-04-21) Temporary Patch */
    setAffiliatePlan(plan: AffiliatePlan): Observable<ShoutResponse> {        
        const promise: Promise<ShoutResponse> = (async () => {
            const json : string = JSON.stringify({
                affiliatePlanId: 1,
                affiliateDirectPayoutPct: plan.affiliateDirectPayoutPct * 100,
                affiliateSecondaryPayoutPct: plan.affiliateSecondaryPayoutPct * 100,
                affiliateTertiaryPayoutPct: plan.affiliateTertiaryPayoutPct * 100,
                playerInitialPayoutPct: plan.playerInitialPayoutPct * 100,
                current: true
            })       

            await AWSService.uploadText(SHOUTTRIVIA_AFFILIATE_PLAN, json);

            return ({
                success: true,
                ticketResponse: {
                    ticket: "last-document",
                    estimatedWaitTime: 160,
                    encryptKey: uuid(),
                },
                unauthorized: false,
                subscriberNotFound: false
            });
        })();    
        
        return from(promise);
    }
    /* */

    /* (Rafael Solano 2022-04-21) Temporary Patch *
    setAffiliatePlan(plan: AffiliatePlan): Observable<ShoutResponse> {
        return this.httpService.sendRequest('/snowladmin/affiliateplan/add', plan.toJsonObject());
    }
    /* */

    /* (Rafael Solano 2022-04-21) Temporary Patch */
    getCurrentAffiliatePlanAxios(): Observable<AffiliatePlan> {            
        const documentsUrl = environment.domains.documentsUrl;

        const promise = (async () => {
            
            const url = `${documentsUrl}/last-document`;            

            let plan: AffiliatePlan = new AffiliatePlan({
                affiliatePlanId: 0,
                affiliateDirectPayoutPct: 0,
                affiliateSecondaryPayoutPct: 0,
                affiliateTertiaryPayoutPct: 0,
                playerInitialPayoutPct: 0,
                current: true,
            });
    
            try {
                const json = await AWSService.fetchText(SHOUTTRIVIA_AFFILIATE_PLAN);
                const retrievedPlan: AffiliatePlan = JSON.parse(json);                                
                
                plan = new AffiliatePlan({
                    affiliatePlanId: retrievedPlan.affiliatePlanId,
                    affiliateDirectPayoutPct: retrievedPlan.affiliateDirectPayoutPct / 100,
                    affiliateSecondaryPayoutPct: retrievedPlan.affiliateSecondaryPayoutPct / 100,
                    affiliateTertiaryPayoutPct: retrievedPlan.affiliateTertiaryPayoutPct / 100,
                    playerInitialPayoutPct: retrievedPlan.playerInitialPayoutPct / 100,
                    current: true
                });

            } catch(error) {
                console.warn(JSON.stringify(error));
            }

            return plan;
        })();
        
        return from(promise);
    }
    /* */

    /* (Rafael Solano 2022-04-21) Temporary Patch *
    getCurrentAffiliatePlanAxios(): Observable<AffiliatePlan> {            
        
        const promise = (async () => {
            const url = `${environment.srd.wdsUrl}/affiliatePlan.json`;            
            let plan: AffiliatePlan = new AffiliatePlan({
                affiliatePlanId: 0,
                affiliateDirectPayoutPct: 0,
                affiliateSecondaryPayoutPct: 0,
                affiliateTertiaryPayoutPct: 0,
                playerInitialPayoutPct: 0,
                current: true,
            });
    
            try {
                const result = await axios.get<AffiliatePlan>(url);
                plan = result.data;
            } catch(error) {
                console.warn(JSON.stringify(error));
            }

            return plan;
        })();
        
        return from(promise);
    }
    /* */
       
    getCurrentAffiliatePlan(): Observable<AffiliatePlan> {
        return this.getCurrentAffiliatePlanAxios();       
    }

    // getReferralInfo(): Observable<ReferralResponse> {
    //     return this.httpService.sendRequest<ReferralResponse>('/snowladmin/referralInfo').pipe(
    //         map(resp => {
    //             if (resp.success) {
    //                 resp.referralTransactions = resp.referralTransactions.sort((a, b) => a.date > b.date ? -1 : 1);
    //                 resp.referredSubscribers = resp.referredSubscribers.sort((a, b) => a.date > b.date ? -1 : 1);
    //             }
    //             return resp;
    //         })
    //     );
    // }

    getReferralInfo(): Observable<ReferralResponse> {
        const zukiURL = environment.domains.zukiURL;
        return this.httpService.getZukiResponse<ReferralResponse>(`${zukiURL}/referral/referral-info`).pipe(
            map(resp => {
                if (resp.success) {
                    resp.referralTransactions = resp.referralTransactions.sort((a, b) => a.date > b.date ? -1 : 1);
                    resp.referredSubscribers = resp.referredSubscribers.sort((a, b) => a.date > b.date ? -1 : 1);
                }
                return resp;
            })
        );
    }    
}

export interface ReferralResponse extends ShoutResponse {
    referredSubscribers: {
        date: Date,
        nickname: string,
        referrerNickname: string
    }[],
    referralTransactions: {
        date: Date,
        nickname: string,
        amount: number
    }[],
    affiliateNicknames: string[]
}
