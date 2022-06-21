import {BaseSocketService, Socket} from "../base-app/shared/index";
import {Injectable} from "@angular/core";
import {MOCK_SOCKET} from "@snowl/mock/mock.socket";

@Injectable()
export class MockSocketService extends BaseSocketService {
  createSocket(url: string): Socket {
    return MOCK_SOCKET;
  }

}
