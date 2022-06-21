import {DeviceActions, DeviceResize} from '../actions/device.actions';

export interface DeviceState {
  width: number;
  height: number;
  isMobile: boolean;
}

let defaultState: DeviceState = {
  width: window.innerWidth,
  height: window.innerHeight,
  isMobile: isMobile(window.innerWidth)
};

export function reducer(state = defaultState, action: DeviceActions): DeviceState {
  switch (action.type) {
    case DeviceResize.type:
      const result = {
        width: action.payload.width,
        height: action.payload.height,
        isMobile: isMobile(action.payload.width)
      };
      defaultState = result; // This keeps the device changes around when logging out
      return result;

    default:
      return state;
  }
}

function isMobile(width: number): boolean {
  return width <= 480;
}
