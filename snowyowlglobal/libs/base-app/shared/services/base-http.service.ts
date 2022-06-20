import {throwError as observableThrowError, Observable, timer, Subject, of, from} from 'rxjs';
import { getSrdFromSrd3, ShoutResponse, SRD, SRD3, TicketResponse, ZukiResponse } from '../../model';
import {Inject, Injectable, InjectionToken} from '@angular/core';
import {HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpResponse} from '@angular/common/http';
import {catchError, filter, map, mergeMap, switchMap, take, tap} from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { getSrd } from '@snowl/app-store/selectors/http.selectors';
import { AppState } from '@snowl/app-store/reducers';
import { getDeviceId, getSessionKey } from '@snowl/app-store/selectors';
import { ShoutErrorResponse, ZukiErrorResponse } from '../../error';
import { HttpError } from '@snowl/base-app/error';
import { getValue } from '@snowl/base-app/util';
import {environment} from "@snowl/environments/environment";
import {Err, Ok, Result} from 'ts-results';

export interface DeviceInfo {
  model: string;
  version: string;
  name: string;
  osName: string;
  osType: string;
}
export const DEVICE_INFO = new InjectionToken<DeviceInfo>('DeviceInfo');

const SRD_URL = environment.srdURL;

@Injectable()
export class BaseHttpService {
  srd$: Observable<SRD>;
  deviceId$: Observable<string>;
  sessionKey$: Observable<string | undefined>;

  constructor(private http: HttpClient, private store: Store<AppState>, @Inject(DEVICE_INFO) private deviceInfo: DeviceInfo) {
    this.srd$ = store.pipe(select(getSrd)).pipe(filter(srd => !!srd), take(1)) as any;
    this.deviceId$ = store.pipe(select(getDeviceId)).pipe(filter(id => !!id), take(1)) as any;
    this.sessionKey$ = store.pipe(select(getSessionKey));
  }

  static delay = (ms:number) => {
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = Date.now();
   }    
  }

  static wait = <T  extends ShoutResponse,> (
      milliseconds: number,
      result: Result<T, ShoutErrorResponse<T>>
    ): Result<T, ShoutErrorResponse<T>> => {
    BaseHttpService.delay(5000);
    return result;
  }

  delayedCollectorRequest<T extends ShoutResponse>(milliseconds: number, url: string, body: any = {}, deviceHeaders = false): Observable<Result<T, ShoutErrorResponse<T>>> {
    const response = this.srd$.pipe(
      switchMap(srd => {
        const requestBody = prepareRequestBody(body, srd);
        let ticketResponse: TicketResponse;
        return this.http.post<TicketResponse>(srd.collectorUrl + url, requestBody, { headers: this.getHeaders(deviceHeaders) }).pipe(
          switchMap(response => {
            ticketResponse = response;
            return this.sendAndRetryOnError<T>(response, srd, 0);
          }), 
          map(result => {
            result.ticketResponse = ticketResponse;
            const res = (() => {
              if (result.success === false) {
                return Err(new ShoutErrorResponse(result));
              }

              const ok = Ok(result as T);
              return of(BaseHttpService.wait(5000, ok));
            })();
            return res;
          }),
          catchError(e => {
            console.error('Found unexpected error sending collector request: ', url);
            console.error(e);
            return of(Err(e))
          })
        );
      })
    );

    return (response as unknown) as Observable<Result<T, ShoutErrorResponse<T>>>;
  }

  sendCollectorRequest<T extends ShoutResponse>(url: string, body: any = {}, deviceHeaders = false): Observable<Result<T, ShoutErrorResponse<T>>> {
    return this.srd$.pipe(
      switchMap(srd => {
        const requestBody = prepareRequestBody(body, srd);
        let ticketResponse: TicketResponse;
        return this.http.post<TicketResponse>(srd.collectorUrl + url, requestBody, { headers: this.getHeaders(deviceHeaders) }).pipe(
          switchMap(response => {
            ticketResponse = response;
            return this.sendAndRetryOnError<T>(response, srd, 0);
          }),
          map(result => {
            result.ticketResponse = ticketResponse;

            if (result.success === false) {
              return Err(new ShoutErrorResponse(result));
            }

            return Ok(result as T);
          }),
          catchError(e => {
            console.error('Found unexpected error sending collector request: ', url);
            console.error(e);
            return of(Err(e))
          })
        );
      })
    );
  }

  getZukiResponse<T>(url: string, deviceHeaders = true): Observable<Result<T, ZukiErrorResponse<T>>> {
    return this.srd$.pipe(
      switchMap(srd => {        
        return this.http.get<ZukiResponse<T>>(url, { headers: this.getHeaders(deviceHeaders) }).pipe(
          map(result => {
            const entity = result.entity;
            
            return Ok(entity as T);
          }),
          catchError(e => {
            console.error('Found unexpected error sending zuki request: ', url);
            console.error(e);
            return of(Err(e))
          })
        );
      })
    );
  }  
  
  sendSynchronousCollectorRequest<T extends ShoutResponse>(url: string, body: any = {}): Observable<Result<T, ShoutErrorResponse<T>>> {
    return this.srd$.pipe(
      switchMap(srd => {
        const requestBody = prepareRequestBody(body, srd);
        return this.http.post<T>(srd.collectorUrl + url, requestBody, { headers: this.getHeaders(false) }).pipe(
          map(response => {
            if (response.success === false) {
              return Err(new ShoutErrorResponse(response));
            }
            return Ok(response);
          }),
          catchError(err => {
            console.error('Found unexpected error sending synchronous collector request: ', url);
            console.error(err);
            return of(Err(err))
          })
        );
      })
    );
  }

  getWdsDoc<T>(url: string): Observable<T> {
    return this.srd$.pipe(
      switchMap((srd: SRD) => {
        return this.http.get<T>(srd.wdsUrl + url);
      })
    );
  }

  loadSrd(): Observable<SRD> {
    return this.deviceId$.pipe(
      take(1),
      mergeMap(deviceId => {
        return this.http.get<SRD3>(`${SRD_URL}?client_id=${deviceId}`).pipe(map(srd3 => getSrdFromSrd3(srd3)));
      })
    );
  }

  private sendAndRetryOnError<T>(json: TicketResponse, srd: SRD, attempt: number): Observable<T> {
    const retryTimes = [500, 1000, 5000, 15000, 40000, 100000];

    const request = this.http.get<T>(`${srd.wdsUrl}/${json.ticket}/response.json`).pipe(
      catchError(error => {
        if (error.status === 404 && attempt <= retryTimes.length) {
          const retryTime = retryTimes[attempt - 1];
          return timer(retryTime).pipe(switchMap(() => this.sendAndRetryOnError<T>(json, srd, attempt + 1)));
        } else if (error.status === 401) {
          // TODO: handle 401
        }
        return of({
          success: false,
          message: 'Too many retries'
        } as any as T);
      })
    );

    return timer(json.estimatedWaitTime).pipe(switchMap(() => request));
  }

  public getHeaders(includeDeviceHeaders: boolean): HttpHeaders {
    const deviceId = getValue(this.deviceId$);
    const sessionKey = getValue(this.sessionKey$);

    const deviceHeaders: Dict<string> = includeDeviceHeaders ? {
      'X-REST-DEVICE-ID': deviceId,
      'deviceName': this.deviceInfo.name,
      'deviceModel': this.deviceInfo.model,
      'deviceVersion': this.deviceInfo.version,
      'deviceOsName': this.deviceInfo.osName,
      'deviceOsType': this.deviceInfo.osType
    } : {
      'X-REST-DEVICE-ID': deviceId
    };

    let headers = new HttpHeaders({
      'X-REST-APPLICATION-ID': 'SnowyOwl',
      'X-REST-APPLICATION-VERSION': '1.0',
      'Content-Type': 'application/x-www-form-urlencoded',
      ...deviceHeaders
    });

    if (sessionKey) {
      headers = headers.set('X-REST-SESSION-KEY', sessionKey);
    }

    return headers;
  }
}

function prepareRequestBody(body: any, srd: SRD): string {
  body.toWds = srd.wdsUrl;
  body.appId = 'snowyowl';

  const params = new URLSearchParams();

  for (const key in body) {
    if (body.hasOwnProperty(key) && body[key]) {
      if (body[key].toJSON) {
        body[key] = body[key].toJSON();
      }

      params.set(key, body[key]);
    }
  }

  return params.toString();
}
