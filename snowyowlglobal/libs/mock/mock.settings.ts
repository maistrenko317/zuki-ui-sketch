import {InjectionToken} from "@angular/core";

export const MOCK_SETTINGS = new InjectionToken<MockSettings>('MOCK_SETTINGS');

export interface MockSettings {
  numGames: number;
  numQuestions: number;
  numSubscribers: number;
  allowAllSessionKeys: boolean;
}



export let mockSettings: MockSettings;

export function setMockSettings(settings: MockSettings): void {
  mockSettings = settings;
}
