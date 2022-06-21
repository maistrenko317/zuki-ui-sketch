import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as uuid from 'uuid';
import { Component, Input, OnInit, OnDestroy, OnChanges, AfterViewInit } from '@angular/core';
import { ChangeDetectionStrategy, EventEmitter, Output} from '@angular/core';
import { Referral3TierDTO, ReferralTableProperties, ReferralTransactionDTO, ReferrerEventData } from './types';
import { ReferralTable } from './ReferralTable';
import { ParsedReferredPerson } from '@snowl/base-app/home';
import axios from "axios";
import { environment } from '@snowl/environments/environment';
import { from } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Subscriber } from '../types';

@Component({
  selector: 'sh-referral-table',
  templateUrl: 'referral-table.component.html',
  styleUrls: ['referral-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferralTableComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit{
    public rootDomID: string;
    @Output("referral3TierDTOEvent") referral3TierDTOEvent = new EventEmitter<Referral3TierDTO[]>();
    @Output("referrerEvent") referrerEvent = new EventEmitter<ReferrerEventData>();
    @Input() nicknameStack: string[] =[ ];
    @Input() nickname: string;

    protected getRootDomNode() {
        const node = document.getElementById(this.rootDomID);
        if(!node) {
            throw new Error(`Node '${this.rootDomID} not found!`);
        }
        return node;
    }    

    private isMounted(): boolean {
        return !!this.rootDomID;
    }
 
  
    private renderAffiliates(nickname: string | number, httpOptions: any) {

        const referral3TierDTOPromise = (async () => {
            const referral3TierResponse = await axios.get<Referral3TierDTO[]>(`${environment.zukiURL}/referral/3tiers/${nickname}`, httpOptions)
            const referral3Tier = (referral3TierResponse.data as any).entity as Referral3TierDTO[];            
            let transactions:ReferralTransactionDTO[] = []

            if(this.nicknameStack.length > 0) {
                const referralTransactionsResponse = await axios.get<ReferralTransactionDTO[]>(`${environment.zukiURL}/referral/transactions/${nickname}`, httpOptions)
                transactions = (referralTransactionsResponse.data as any).entity as ReferralTransactionDTO[];
            }

            const props = {
                referral3TierDTOList: referral3Tier,
                transactions: transactions,
                onReferralRowClick: (nickName: string) => this.push(nickName),
                onBreadcrumClick: (level: number) => this.jumpTo(level),
                nicknameStack: [...this.nicknameStack]
            }

            ReactDOM.render(React.createElement(ReferralTable, props), this.getRootDomNode());   
            return referral3Tier;             
        })();
        from(referral3TierDTOPromise).subscribe(response => {this.referral3TierDTOEvent.emit(response);})
    }

    private renderAvatar(nickname: string | number, httpOptions: any) {
        const subscriberPromise = (async () => {
            const url = `${environment.zukiURL}/subscriber/${nickname}`;
            const response = await axios.get<Subscriber>(url, httpOptions)
            const data = (response.data as any).entity as Subscriber;
            
            return data;             
        })();

        const nicknameStack = this.nicknameStack;
        from(subscriberPromise).subscribe(response => {this.referrerEvent.emit({            
            subscriber: response, level:nicknameStack.length, onReferralBackClick: () => this.pop()
        })});
    }
    protected render() {        
        if (this.isMounted() && this.nickname) {
            const personNickName = this.nickname;
            const nicknameStack = this.nicknameStack;
            const levelNickName = nicknameStack.length == 0 ? personNickName : nicknameStack[nicknameStack.length-1];
            const httpOptions = {headers: {"X-REST-SESSION-KEY": uuid.v4()}}

            this.renderAffiliates(levelNickName, httpOptions);
            this.renderAvatar(levelNickName, httpOptions);

        }
    }
 
    ngOnInit() {
        this.rootDomID = `referral-tree-${uuid.v1()}`;
    }
     
    public pop() {        
        if(this.nicknameStack.length > 0) {
            const nicknameStack = [...this.nicknameStack];
            nicknameStack.pop();
            this.nicknameStack = nicknameStack;
            this.render();
        }
    }

    public jumpTo(level: number) {
        if(this.nicknameStack.length == 1) {
            this.pop()
        } else {
            const nicknameStack = this.nicknameStack.slice(0, level+1);    
            console.log(nicknameStack);
            this.nicknameStack = nicknameStack;
        }
        this.render();
    }

    public push(nickname: string) {
        this.nicknameStack = [...this.nicknameStack, nickname];
        this.render();
    }
    ngOnChanges() {
        this.render();
    }
 
    ngAfterViewInit() {
        this.render();
    }
 
    ngOnDestroy() {
        // Uncomment if Angular 4 issue that ngOnDestroy is called AFTER DOM node removal is resolved
        // ReactDOM.unmountComponentAtNode(this.getRootDomNode())
    }       
}
