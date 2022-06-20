import {Mocks, MockApi} from "@snowl/mock/mocks/mocks";
import {BooleanFlag, SRD3} from "@snowl/base-app/model";

export class MiscMocks extends Mocks {
  @MockApi(/snowl-srd-server/g)
  mockSrd(): SRD3 {
    return {
      actions: {
        wms: 'wms',
        socketio: 'socketio',
        collector: 'collector',
        wds: 'wds',
        web: 'web',
      },

      servers: {
        wms: [{baseUrl: 'wms'}],
        socketio: [{baseUrl: 'socketio'}],
        collector: [{baseUrl: 'collector'}],
        wds: [{baseUrl: 'wds'}],
        web: [{baseUrl: 'web'}],
      }
    }
  }

  @MockApi(/canSeeContentWithoutLogin.json/g)
  mockCanSeeContentWithoutLogin(): BooleanFlag<'canSeeContentWithoutLogin'> {
    return {
      canSeeContentWithoutLogin: true
    }
  }
}
