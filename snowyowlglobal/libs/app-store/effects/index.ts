import { HttpEffects } from './http.effects';
import { GameEffects } from './game.effects';
import { CategoriesEffects } from './categories.effects';
import { LocalStorageEffects } from './local-storage.effects';
import { AuthEffects } from './auth.effects';
import { PublicProfileEffects } from './public-profile.effects';
import { GameplayEffects } from './gameplay.effects';
import { LegalEffects } from './legal.effects';
import {NotificationEffects} from "./notification.effects";
import {SocialEffects} from '@snowl/app-store/effects/social.effects';
import {EffectsUtils} from '@snowl/app-store/effects/effects-utils.service';

export * from './http.effects';
export * from './game.effects';
export * from './local-storage.effects';
export * from './categories.effects';
export * from './auth.effects';
export * from './public-profile.effects';
export * from './gameplay.effects';
export * from './legal.effects';
export * from './notification.effects';
export * from './social.effects';
export * from './effects-utils.service';

export const BASE_APP_EFFECTS = [
  HttpEffects,
  GameEffects,
  CategoriesEffects,
  LocalStorageEffects,
  AuthEffects,
  PublicProfileEffects,
  LegalEffects,
  NotificationEffects,
  SocialEffects,
  EffectsUtils
];

export const GAME_MODULE_EFFECTS = [
  GameplayEffects,
];
