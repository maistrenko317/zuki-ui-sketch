import { Provider } from '@angular/core';
import { BaseMediaService } from './base-media.service';
import { BasePaymentService } from '@snowl/base-app/user/base-payment.service';
import { BasePlaceService } from '@snowl/base-app/user/base-place.service';

export * from './base-edit-me-details.component';
export * from './base-edit-me.component';
export * from './base-media.service';
export * from './base-wallet.component';
export * from './base-add-money.component';
export * from './base-payment.service';
export * from './base-add-money-stepper.component';
export * from './base-card-form.component';
export * from './base-echeck-form.component';
export * from './states';
export * from './base-place.service';
export * from './base-redeem.component';
export * from './base-tool.service';

export const USER_PROVIDERS: Provider[] = [BaseMediaService, BasePaymentService];
