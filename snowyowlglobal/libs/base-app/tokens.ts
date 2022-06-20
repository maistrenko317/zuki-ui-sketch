import {InjectionToken} from "@angular/core";

export type Platform = 'Web' | 'Mobile';
export const PLATFORM = new InjectionToken<Platform>('CURRENT_PLATFORM');
