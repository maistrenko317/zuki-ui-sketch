import {Injectable} from '@angular/core';
import {BaseHttpService} from '@snowl/base-app/shared';
import {Observable, of} from 'rxjs';
import {ShoutResponse} from '@snowl/base-app/model';
import {catchError, map} from 'rxjs/operators';
import {elseMap, resultMap} from 'ts-results/rxjs-operators';

@Injectable()
export abstract class BaseToolService {
  constructor(private http: BaseHttpService) {

  }

  shortenUrl(path: string): Observable<string> {
    return this.http.sendCollectorRequest<ShortenURLResponse>('/snowl/shorturl/get', {path}).pipe(
      resultMap(resp => resp.shortUrl),
      elseMap(e => `https://shouttrivia.com/${path}`)
    );
  }

  abstract copyToClipboard(string: string): boolean;
}

interface ShortenURLResponse extends ShoutResponse {
  shortUrl: string;
}
