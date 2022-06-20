import {Injectable} from "@angular/core";
import {BaseSocketService, Socket} from "@snowl/base-app/shared";
import * as io from "socket.io-client";

@Injectable()
export class SocketService extends BaseSocketService {
  createSocket(url: string): Socket {
    return io(url, {
      forceNew: true
    });
  }
}
