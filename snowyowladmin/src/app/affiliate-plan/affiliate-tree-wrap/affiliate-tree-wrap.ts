import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as uuid from 'uuid';
import { Component, OnInit, OnDestroy, OnChanges, AfterViewInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { environment } from 'environments/environment';
import { AffiliateTreeProperties } from './types';
import { AffiliateTree } from './AffiliateTree';
import { HttpService } from 'app/shared/services/http.service';



@Component({
  selector: 'affiliate-tree-wrap',
  templateUrl: './affiliate-tree-wrap.html',
  styleUrls: ['./affiliate-tree-wrap.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AffiliateTreeWrapComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit{
    public rootDomID: string = "";
    
    public constructor(public httpService: HttpService) {

    }
    
    protected getRootDomNode() {
        const node = document.getElementById(this.rootDomID);
        if(!node) {
            throw new Error(`Node '${this.rootDomID} not found!`);
        }
        return node;
    }    

    protected getProps(): AffiliateTreeProperties {
        const headers =  this.httpService.getHeaders(true);
        const keys = headers.keys();
        const zukiURL = environment.domains.zukiURL;

        return {
            baseUrl: zukiURL,
            headers: keys.reduce((h: any, k: string) => ({...h, [k]: headers.get(k)}), {}) as Record<string, string>
        };
    } 
    private isMounted(): boolean {
        return !!this.rootDomID;
    }
 
    protected render() {
        const properties = this.getProps();        
        
        if (this.isMounted() && properties) {
            (async () => {
                ReactDOM.render(React.createElement(AffiliateTree, this.getProps()), this.getRootDomNode());
            })();
        }
    }
 
    ngOnInit() {
        this.rootDomID = `affiliate-tree-${uuid.v1()}`;
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
