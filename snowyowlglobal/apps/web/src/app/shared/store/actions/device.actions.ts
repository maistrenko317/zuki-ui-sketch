import { Action } from '@ngrx/store';

const DEVICE_RESIZE = '[Device] resize';
export class DeviceResize implements Action {
  static readonly type = DEVICE_RESIZE;
  readonly type = DEVICE_RESIZE;
  constructor(public payload: { width: number; height: number }) {}
}

export type DeviceActions = DeviceResize;
