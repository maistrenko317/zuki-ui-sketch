import {InjectionToken, Injector, ModuleWithComponentFactories, ModuleWithProviders, NgModule} from "@angular/core";
import {BaseSocketService} from "@snowl/base-app/shared";
import {MockSocketService} from "@snowl/mock/mock-socket.service";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {MockHttpInterceptor} from "@snowl/mock/mock-http-interceptors";

@NgModule({
})
export class MockModule  {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MockModule,
      providers: [
        {
          provide: BaseSocketService,
          useClass: MockSocketService
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: MockHttpInterceptor,
          multi: true
        }
      ]
    }
  }
}
