import {Injectable, NgZone} from "@angular/core";
import {BaseHttpService} from "@snowl/base-app/shared/services/base-http.service";
import { select, Store } from '@ngrx/store';
import {Observable, Subject} from "rxjs";

@Injectable()
export abstract class BaseSocketService {
  private socket?: Socket;

  private emitters: {[event: string]: Subject<any>} = {};
  constructor(private http: BaseHttpService, private store: Store<any>, private zone: NgZone) {

  }

  abstract createSocket(url: string): Socket;

  connect(primaryIdHash: string): void {
    this.http.srd$.subscribe(srd => {
      this.disconnect();

      const socket = this.createSocket(srd.socketIOUrl);//'http://localhost:3000');

      socket.on('connect', () => {
        socket.emit('client_checkin', primaryIdHash);
      });

      for (const event of Object.keys(this.emitters)) {
        socket.on(event, (data) => {
          this.zone.run(() => this.emitters[event].next(data ? JSON.parse(data) : data));
        });
      }

      this.socket = socket;
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = undefined;
    }
  }

  on<T = string>(event: string): Observable<T> {
    const emitter = this.emitters[event] = this.emitters[event] || new Subject<T>();

    if (this.socket) {
      this.socket.on(event, (data: string) => {
        this.zone.run(() => emitter.next(data ? JSON.parse(data) : data));
      });
    }

    return emitter.asObservable();
  }
}

export interface Socket {
  on<T = string>(event: string, callback: (data: T) => any): void;
  emit(event: string, data: any): void;
  close(): void;
}

export type SocketCallback<T> = (data: T) => any;
