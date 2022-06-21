import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditMeComponent } from './edit-me.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { EditMeDetailComponent } from './edit-me-detail/edit-me-detail.component';
import { BasePlaceService, USER_PROVIDERS } from '@snowl/base-app/user';
import { EffectsModule , ofType} from '@ngrx/effects';
import { USER_EFFECTS } from '@snowl/user-store/effects';
import { StoreModule } from '@ngrx/store';
import { userReducers } from '@snowl/user-store/reducers';
import { WalletComponent } from './wallet/wallet.component';
import { AddMoneyComponent } from './add-money/add-money.component';
import {VxCheckboxComponent, VxCheckboxModule, VxRadioModule, VxStepperModule} from 'vx-components';
import { AddMoneyStepperComponent } from './add-money-stepper/add-money-stepper.component';
import { CardFormComponent } from './card-form/card-form.component';
import { USER_VALIDATORS } from '@snowl/base-app/user/validators';
import { EcheckFormComponent } from './echeck-form/echeck-form.component';
import { PlaceService } from './place.service';
import {ResizeImageComponent} from "./resize-image/resize-image.component";
import {WithdrawComponent} from "./withdraw/withdraw.component";
import {NotificationPrefsComponent} from "../shared/notification-prefs/notification-prefs.component";
import {RedeemComponent} from './redeem/redeem.component';

const routes: Routes = [
  { path: '', component: EditMeComponent, pathMatch: 'full' },
  { path: 'wallet', component: WalletComponent },
  { path: 'wallet/add', component: AddMoneyComponent },
  { path: 'wallet/withdraw', component: WithdrawComponent },
  { path: 'wallet/redeem', component: RedeemComponent },
  { path: 'notifications', component: NotificationPrefsComponent}
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    EffectsModule.forFeature(USER_EFFECTS),
    StoreModule.forFeature('user', userReducers),
    VxStepperModule,
    VxRadioModule
  ],
  declarations: [
    EditMeComponent,
    EditMeDetailComponent,
    WalletComponent,
    AddMoneyComponent,
    AddMoneyStepperComponent,
    CardFormComponent,
    EcheckFormComponent,
    NotificationPrefsComponent,
    ...USER_VALIDATORS,
    ResizeImageComponent,
    WithdrawComponent,
    RedeemComponent
  ],
  entryComponents: [ResizeImageComponent],
  providers: [...USER_PROVIDERS, { provide: BasePlaceService, useClass: PlaceService }]
})
export class UserModule {}
