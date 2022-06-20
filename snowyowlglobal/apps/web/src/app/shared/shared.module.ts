import {ErrorHandler, ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  NavHeaderContentDirective,
  NavHeaderLeftDirective,
  NavHeaderRightDirective,
  NavItemDirective,
  PageBodyDirective,
  PageComponent
} from './page/page.component';
import {StoreModule} from '@ngrx/store';
import {sharedFeatureReducers} from './store/reducers';
import {EffectsModule, ofType} from '@ngrx/effects';
import {sharedFeatureEffects} from './store/effects';
import {FormsModule} from '@angular/forms';
import {BaseGameService} from '@snowl/base-app/shared/services/base-game.service';
import {GameCardComponent} from './game-card/game-card.component';
import {DefaultImageDirective} from './directives/default-image.directive';
import {BaseCategoryService} from '@snowl/base-app/shared/services/base-category.service';
import {LocalStorage} from './local-storage';
import {
  BaseAnimateNumberPipe,
  BaseCategoryNamePipe,
  BaseDialogService,
  BaseHttpService,
  BaseI18nPipe,
  BaseImageStoreService,
  BaseLocalStorage, BaseNotificationService,
  BasePublicProfilePipe, BaseRepeatPipe,
  BaseSubscriberService, DEVICE_INFO,
  SHARED_VALIDATORS
} from '@snowl/base-app/shared';
import {DialogService} from './services/dialog.service';
import {
  VxAutocompleteModule,
  VxCheckboxModule,
  VxDialogModule,
  VxFormFieldModule,
  VxSliderModule,
  VxPagerModule,
  VxSpinnerModule, VxToastModule
} from 'vx-components';
import {CustomErrorHandler} from '@snowl/base-app/error-handler';
import {LoadingComponent} from './loading/loading.component';
import {BASE_GUARDS} from '@snowl/base-app/guards';
import {BaseDatePipe} from '@snowl/base-app/shared/pipes/base-date.pipe';
import {PersonComponent} from './person/person.component';
import {BaseLegalService} from '@snowl/base-app/legal/base-legal.service';
import {LogService} from "@snowl/base-app/shared/services/log.service";
import {BaseSocketService} from "@snowl/base-app/shared/services/base-socket.service";
import {SocketService} from "./services/socket.service";
import {PLATFORM} from "@snowl/base-app/tokens";
import {PayoutSliderComponent} from "./payout-slider/payout-slider.component";
import {getDeviceInfo} from "./device-info";
import {HttpErrorHandler} from '@snowl/base-app/error-handler/http.error-handler';
import {BaseToolService} from '@snowl/base-app/user/base-tool.service';
import {ToolService} from './services/tool.service';
import {FormattedDialogComponent} from './formatted-dialog/formatted-dialog.component';
import {BaseRoleDirective} from '@snowl/base-app/shared/directives';
import {MaskDirective} from './directives/mask.directive';
import { library } from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {
  faAxeBattle,
  faCheckCircle, faChevronDown, faChevronLeft, faChevronRight, faChevronUp, faCreditCard, faDagger, faHammerWar,
  faHeart, faInfoCircle, faMace, faPencil,
  faSearchMinus,
  faSearchPlus, faSickle, faSword,
  faTimes, faTimesCircle, faScythe,   
  faCalendar, faAward, faTicket, faClock,
  faEye, faCalendarCheck,
  faTrophyAlt, faSackDollar,
  faExternalLinkSquare, faListUl,
  faGamepad, faWallet, faTrophy,
  faEnvelopeOpenDollar, faMoneyBillWave,  
  faPlusCircle, faMinusCircle, faGiftCard,
  faBellExclamation, faSignOut,
  faCopy, faFolderTree
} from '@fortawesome/pro-solid-svg-icons';


import {
  faCcAmex,
  faCcDinersClub,
  faCcDiscover,
  faCcJcb,
  faCcMastercard,
  faCcVisa
} from '@fortawesome/free-brands-svg-icons';
import {
  faHeart as faHeartSolid
} from '@fortawesome/pro-regular-svg-icons';
import { GameDetailsComponent } from '../game/game-details/game-details.component';

library.add(  
  faFolderTree,
  faCopy,
  faSignOut,
  faPlusCircle, faMinusCircle,
  faBellExclamation,
  faGiftCard,
  faMoneyBillWave,
  faEnvelopeOpenDollar,
  faWallet,
  faGamepad,
  faListUl,
  faExternalLinkSquare,
  faSackDollar,
  faTrophyAlt,
  faCalendarCheck,
  faEye,
  faClock,
  faTicket,
  faAward,
  faCalendar,
  faHeart,
  // faHeartBroken,
  faCheckCircle,
  faTimes,
  faSearchPlus,
  faSearchMinus,
  faPencil,
  faChevronUp,
  faChevronDown,
  faChevronRight,
  faChevronLeft,
  faTimesCircle,
  faInfoCircle,
  faCreditCard,
  faCcVisa,
  faCcMastercard,
  faCcDiscover,
  faCcAmex,
  faCcJcb,
  faCcDinersClub,
  faHeartSolid,
  faHammerWar,
  faDagger,
  faAxeBattle,
  faMace,
  faSword,
  faSickle,
  faScythe
);

const pageComponents = [
  PageComponent,
  PageBodyDirective,
  NavHeaderLeftDirective,
  NavHeaderRightDirective,
  NavHeaderContentDirective,
  NavItemDirective
];
const sharedComponents = [
  GameCardComponent,
  BaseI18nPipe,
  BaseAnimateNumberPipe,
  BaseCategoryNamePipe,
  BaseDatePipe,
  BasePublicProfilePipe,
  BaseRepeatPipe,
  PersonComponent,
  LoadingComponent,
  PayoutSliderComponent,
  FormattedDialogComponent
];
const sharedDirectives = [
  DefaultImageDirective,
  BaseRoleDirective,
  MaskDirective,
  ...SHARED_VALIDATORS
];

const sharedModules = [CommonModule, FormsModule, VxDialogModule, VxSpinnerModule,
  VxSliderModule, VxCheckboxModule, VxFormFieldModule, VxAutocompleteModule, VxPagerModule,
  VxToastModule, FontAwesomeModule];

@NgModule({
  imports: [
    ...sharedModules,
    StoreModule.forFeature('shared', sharedFeatureReducers),
    EffectsModule.forFeature(sharedFeatureEffects)
  ],
  declarations: [...pageComponents, ...sharedComponents, ...sharedDirectives],
  exports: [...sharedModules, ...pageComponents, ...sharedComponents, ...sharedDirectives],
  entryComponents: [LoadingComponent, PayoutSliderComponent, FormattedDialogComponent],
  providers: [{provide: BaseDialogService, useClass: DialogService}]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        ...BASE_GUARDS,
        HttpErrorHandler,
        BaseGameService,
        BaseCategoryService,
        BaseSubscriberService,
        BaseHttpService,
        BaseImageStoreService,
        BaseLegalService,
        BaseNotificationService,
        {provide: BaseToolService, useClass: ToolService},
        {provide: BaseSocketService, useClass: SocketService},
        {provide: BaseLocalStorage, useClass: LocalStorage},
        {provide: ErrorHandler, useClass: CustomErrorHandler},
        {provide: PLATFORM, useValue: 'Web'},
        {provide: DEVICE_INFO, useFactory: getDeviceInfo},
        LogService
      ]
    };
  }
}
