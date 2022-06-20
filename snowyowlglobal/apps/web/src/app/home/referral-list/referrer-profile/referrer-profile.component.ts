import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as uuid from 'uuid';
import { Component, Input, OnInit, OnDestroy, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';
import { ChangeDetectionStrategy, EventEmitter, Output} from '@angular/core';
import axios from "axios";
import { environment } from '@snowl/environments/environment';
import { from } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ReferrerProfile } from './ReferrerProfile';
import { Subscriber } from '../types';
import { GlobalEarningsDTO, onProfileBackClickHandler, Referrer } from './types';

@Component({
  selector: 'sh-referrer-profile',
  templateUrl: 'referrer-profile.component.html',
  styleUrls: ['referrer-profile.component.scss'], // ReferralSummaryComponent
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferrerProfileComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit{
    @Input("nickname")  nickname: string;
    @Input("level") level: number = 0;
    @Input("onProfileBackClick") onProfileBackClick: onProfileBackClickHandler = (nickname?: string) =>{};
    public rootDomID: string;

    private isMounted(): boolean {
        return !!this.rootDomID;
    }

    protected getRootDomNode() {
        const node = document.getElementById(this.rootDomID);
        if(!node) {
            throw new Error(`Node '${this.rootDomID} not found!`);
        }
        return node;
    }    

    render() {   
        if (this.isMounted() && this.nickname) {     
            (async () => {
                const referrerResponse = await axios.get<Referrer>(`${environment.zukiURL}/referral/referrer/${this.nickname}`, {headers: {"X-REST-SESSION-KEY": uuid.v4()}})
                const referrer = (referrerResponse.data as any).entity as Referrer;

                const globalEarningsResponse = await axios.get<GlobalEarningsDTO>(`${environment.zukiURL}/referral/referrer/earnings/global/${this.nickname}`, {headers: {"X-REST-SESSION-KEY": uuid.v4()}})
                const globalEarnings = (globalEarningsResponse.data as any).entity as GlobalEarningsDTO;
                
                ReactDOM.render(React.createElement(
                    ReferrerProfile, 
                    {referrer: referrer, globalEarnings: globalEarnings, level: this.level, onProfileBackClick: this.onProfileBackClick}), 
                    this.getRootDomNode(),                    
                );
            })();
        }
    }

    ngOnChanges() {
        this.render();
    }
 
    ngAfterViewInit() {
        this.render();
    }
      
    ngOnInit(): void {
        this.rootDomID = `referrer-profile-${uuid.v1()}`;
    }
    ngOnDestroy(): void {
    }
 
}
