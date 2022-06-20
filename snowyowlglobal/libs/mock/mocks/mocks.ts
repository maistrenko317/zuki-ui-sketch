import {HttpRequest, HttpResponse} from "@angular/common/http";
import {uuid} from "@snowl/base-app/util";
import {queryStringToJSON} from "@snowl/mock/mocks/mock-util";
import {setCurrentSession} from "@snowl/mock/mocks/db/subscriber.db";

const tickets: Dict<any> = {};
const ticketRegex = /wds\/(.*?)\/response.json/g;
export class Mocks {
  _mocks: [RegExp, (...args: any[]) => any, MockApiOptions][];

  mockRequest(request: HttpRequest<any>): HttpResponse<any> | null {
    if (request.url.startsWith('collector')) {
      const sessionKey = request.headers.get('X-REST-SESSION-KEY');
      setCurrentSession(sessionKey);
    }

    const ticketResponse = this.checkForTicket(request.url);
    if (ticketResponse) {
      return ticketResponse;
    }

    for (const [regex, mock, options] of this._mocks) {
      const result = regex.exec(request.url);
      regex.lastIndex = 0;

      if (result) {
        const requestBody = queryStringToJSON(request.body || '');
        let body: any;
        try {
          body = mock(requestBody, ...result.slice(1, result.length));
        } catch (e) {
          const message = e.message;
          const errorField = e.errorName || e.message;

          body = {
            success: false,
            message,
            [errorField]: true
          };
        }

        if (request.url.startsWith('collector') && !options.synchronous) {
          const ticket = uuid();
          tickets[ticket] = {
            ...body,
            ticketResponse: undefined
          };

          body = {
            estimatedWaitTime: options.waitTime || 300,
            encryptKey: 'key',
            ...body.ticketResponse,
            ticket,
          }
        }

        // Clone the body so no object refs can change the database.
        body = JSON.parse(JSON.stringify(body));

        return new HttpResponse({
          body
        });
      }
    }

    return null;
  }

  private checkForTicket(url: string): HttpResponse<any> | null {
    const match = ticketRegex.exec(url);
    ticketRegex.lastIndex = 0;

    if (match) {
      const body = tickets[match[1]];
      if (body) {
        return new HttpResponse<any>({
          body: JSON.parse(JSON.stringify(body))
        });
      }
    }

    return null;
  }
}

interface MockApiOptions {
  synchronous?: boolean;
  waitTime?: number;
}
export function MockApi(regex: RegExp, options: MockApiOptions = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!target._mocks) {
      target._mocks = [];
    }
    target._mocks.push([regex, target[propertyKey].bind(target), options]);
  };
}
