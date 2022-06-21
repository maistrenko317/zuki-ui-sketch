import {NgModule} from '@angular/core';

import {AffiliatePlanComponent} from './affiliate-plan.component';
import {SharedModule} from '../shared/shared.module';
import {RouterModule, Routes} from '@angular/router';
import { AffiliateTreeComponent } from './affiliate-tree/affiliate-tree.component';
import { AffiliateTreeWrapComponent } from './affiliate-tree-wrap/affiliate-tree-wrap';
const routes: Routes = [
    {path: '', pathMatch: 'full', component: AffiliatePlanComponent},
    {path: 'tree', component: AffiliateTreeWrapComponent},
    /* {path: 'tree-wrap', component: AffiliateTreeWrapComponent}, */
];

@NgModule({
    imports: [SharedModule, RouterModule.forChild(routes)],
    exports: [],
    declarations: [AffiliatePlanComponent, AffiliateTreeWrapComponent],
    providers: []
})
export class AffiliatePlanModule {
}
