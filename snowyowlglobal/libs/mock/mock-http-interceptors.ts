import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {Observable, of, from, NEVER} from "rxjs";
import {ErrorHandler, Inject, Injectable, Optional} from "@angular/core";
import {catchError, mergeMap, pluck} from "rxjs/operators";
import {Mocks} from "@snowl/mock/mocks/mocks";
import {MOCK_SETTINGS, MockSettings} from "@snowl/mock/mock.settings";

const mockRequest$ = from(import('./mocks'));

let initialized = false;

@Injectable()
export class MockHttpInterceptor implements HttpInterceptor {
  constructor(private errorHandler: ErrorHandler, @Optional() @Inject(MOCK_SETTINGS) private settings: MockSettings | null) {

  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return mockRequest$.pipe(
      mergeMap((mocksImport) => {
        if (!initialized) {
          mocksImport.initializeDb(this.settings || undefined);
          initialized = true;
        }

        const mocks: Mocks[] = mocksImport.MOCKS;
        for (const mock of mocks) {
          const result = mock.mockRequest(req);

          if (result) {
            return of(result);
          }
        }

        if (req.url.indexOf('loggly') !== -1) {
          return of(new HttpResponse({body: {}}))
        }

        debugger;
        return next.handle(req);
      }),
      catchError(e => {
        this.errorHandler.handleError(e);

        return NEVER;
      })
    );
  }

}
