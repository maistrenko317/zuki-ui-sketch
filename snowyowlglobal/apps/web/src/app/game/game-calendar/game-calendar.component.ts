import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as uuid from 'uuid';
import { Component, Input, OnInit, OnDestroy, OnChanges, AfterViewInit } from '@angular/core';
import { ChangeDetectionStrategy, EventEmitter, Output} from '@angular/core';
import { GameCalendar } from './GameCalendar';
import axios from "axios";
import { environment } from '@snowl/environments/environment';
import { from } from 'rxjs';

@Component({
  selector: 'sh-game-calendar',
  templateUrl: 'game-calendar.component.html',
  styleUrls: ['game-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameCalendarComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit{
    public rootDomID: string;

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
 
    protected render() {        
        
        if (this.isMounted()) {
            const props = {pivotDate: new Date(), domain: environment.zukiURL}
            ReactDOM.render(React.createElement(GameCalendar, props), this.getRootDomNode());  
        }
    }
 
    ngOnInit() {
        this.rootDomID = `game-calendar-${uuid.v1()}`;
    }
     
   
    ngOnChanges() {
        this.render();
    }
 
    ngAfterViewInit() {
        this.render();
    }
 
    ngOnDestroy() {
    }       
}
