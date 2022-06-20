import {DeviceInfo} from "@snowl/base-app/shared";
//import ClientJs from 'clientjs';

export function getDeviceInfo(): DeviceInfo {
//  const client = new ClientJs();
//  const browser = client.getBrowser();
//  const os = client.getOS();
//  const engine = client.getEngine();

  //TODO: Do we use any of these things? If not, let's get rid of clientjs;
  return {
   osName: '',// browser.name,
   osType: '',// os.name,
   version: '',// os.version,
   name: '',// browser.version, // TODO: What should I set these values to in the browser?
   model: '',// engine.name + engine.version

  } as any;
}
