import {Injectable} from '@angular/core';
import {BaseHttpService} from '@snowl/base-app/shared';
import {ReferredSubscriber} from '@snowl/base-app/model/referred-subscriber';
import {ReferralTransaction} from '@snowl/base-app/model/referral-transaction';
import {ShoutResponse} from '@snowl/base-app/model';
import {map} from 'rxjs/operators';
import {ShoutErrorResponse, ZukiErrorResponse} from '@snowl/base-app/error';
import {resultMap} from 'ts-results/rxjs-operators';
import axios from 'axios';
import {from, Observable, of} from 'rxjs';
import {Err, Ok, Result} from 'ts-results';
import { environment } from '@snowl/environments/environment';

export interface LoadReferralInfoResponse extends ShoutResponse {
  affiliateNicknames: string[];
  referredSubscribers: ReferredSubscriber[];
  referralTransactions: ReferralTransaction[];
  success: boolean;
}

@Injectable()
export class BaseAffiliateService {
  constructor(private http: BaseHttpService) {

  }

  /* (Rafael Solano 2022-05-23): Deprecated, will be removed in the future */
  loadReferralInfo(): Observable<Result<LoadReferralInfoResponse, ZukiErrorResponse<LoadReferralInfoResponse>>> {    
    const currentUserValue = localStorage.getItem("sub") || "{\"nickname\": \"none\"}";
    const currentUser = JSON.parse(currentUserValue);
    const affiliateNicknames = [currentUser.nickname];

    return of(Ok({
      affiliateNicknames: affiliateNicknames,
      referralTransactions: [],
      referredSubscribers: [],
      success: true
    }));

    /* *
    const result =  this.http.getZukiResponse<LoadReferralInfoResponse>(`${environment.zukiURL}/referral/session`).pipe(
      resultMap(resp => {
        return ({
          affiliateNicknames: [affiliateNicknames],
          referralTransactions: resp.referralTransactions.filter(transaction => transaction.nickname !== resp.affiliateNicknames[0]),
          referredSubscribers: resp.referredSubscribers = resp.referredSubscribers.sort((a, b) => a.date > b.date ? -1 : 1),
          success: true
        })
      })
    );

    return result;
    /* */
 }


 
}


