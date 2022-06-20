import {ErrorHandler, forwardRef, Inject, Injectable, Injector, Optional} from "@angular/core";
import {LogService} from "@snowl/base-app/shared/services/log.service";
import {PLATFORM, Platform} from "@snowl/base-app/tokens";

@Injectable()
export class CustomErrorHandler extends ErrorHandler {
  private _console = console;

  constructor(private injector: Injector, @Inject(PLATFORM) private platform: Platform) {
    super();
  }

  handleError(error: any): void {
    const logger = this.injector.get(LogService);

    // TODO: Remove this when the issue is resolved: https://github.com/NativeScript/nativescript-angular/issues/431
    if (error && error.message && error.message.toUpperCase().indexOf('ANIMATION CANCELLED') !== -1)
      return;

    // TODO: should I parse the stack trace using sourcemaps before sending?
    logger.sendError('Uncaught Error: ', error.toString(), error.stack);

    if (error && error.stack) {
      console.error(error.toString());
      console.error('STACK: ' + error.stack);
    }

    if (this.platform !== 'Mobile') {
      super.handleError(error);
    }
  }

}


