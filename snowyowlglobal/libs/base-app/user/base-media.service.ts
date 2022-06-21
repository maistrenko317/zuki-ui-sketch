import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '@snowl/base-app/shared';
import { map, switchMap } from 'rxjs/operators';
import {uuid} from "@snowl/base-app/util";

@Injectable()
export class BaseMediaService {
  constructor(protected http: HttpClient, protected httpService: BaseHttpService) {}

  uploadImage(image: any): Observable<string> {
    //Defaults to blob
    const imageBlob = image as Blob;
    return this.httpService.srd$.pipe(
      switchMap(srd => {
        const extension = imageBlob.type.replace('image/', '').replace('jpeg', 'jpg');
        const name = uuid() + '.' + extension;
        const formData: FormData = new FormData();
        formData.append('file', imageBlob, name);

        let headers = new HttpHeaders();
        headers = headers.append('Accept', 'application/json');

        return this.http
          .post(`${srd.mediaUrl}/${name}`, formData, { headers, responseType: 'text' })
          .pipe(map(() => `${srd.mediaUrl}/${name}`));
      })
    );
  }
}
