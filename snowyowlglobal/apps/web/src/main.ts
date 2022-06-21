import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import {enableJSONDates} from "@snowl/base-app/json-parser";
import {environment} from "@snowl/environments/environment";
import {enableErrorLogging} from "@snowl/base-app/shared/services/log.service";

enableJSONDates();
enableErrorLogging();

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.log(err));
