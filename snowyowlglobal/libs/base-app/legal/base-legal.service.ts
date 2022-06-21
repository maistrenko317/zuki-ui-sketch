import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseHttpService } from '@snowl/base-app/shared';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class BaseLegalService {
  constructor(private http: HttpClient, private httpService: BaseHttpService) {}

  loadPrivacy(): Observable<string> {
    return this.httpService.srd$.pipe(
      switchMap(srd => {
        return this.http.get(`${srd.webUrl}/legal/privacy.html`, { responseType: 'text' });
      })
    );
  }

  loadTerms(): Observable<string> {
    return this.httpService.srd$.pipe(
      switchMap(srd => {
        return this.http.get(`${srd.webUrl}/legal/terms.html`, { responseType: 'text' });
      })
    );
  }
}
