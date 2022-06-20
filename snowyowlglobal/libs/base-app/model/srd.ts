export interface SRD {
  mediaUrl: string;
  socketIOUrl: string;
  wdsUrl: string;
  collectorUrl: string;
  webUrl: string;
}

export interface SRD3 {
  actions: {
    wms: string;
    socketio: string;
    collector: string;
    wds: string;
    web: string;
  };

  servers: Dict<[{ baseUrl: string }]>;
}

export function getSrdFromSrd3(srd3: SRD3): SRD {
  return {
    mediaUrl: srd3.servers[srd3.actions.wms][0].baseUrl,
    socketIOUrl: srd3.servers[srd3.actions.socketio][0].baseUrl,
    collectorUrl: srd3.servers[srd3.actions.collector][0].baseUrl,
    wdsUrl: srd3.servers[srd3.actions.wds][0].baseUrl,
    webUrl: srd3.servers[srd3.actions.web][0].baseUrl
  };
}
export interface SRDUrl {
  srd: string;
}
