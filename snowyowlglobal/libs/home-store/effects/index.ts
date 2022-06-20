import { LayoutEffects } from '@snowl/home-store/effects/layout.effects';
import {AffiliateEffects} from '@snowl/home-store/effects/affiliate.effects';

export * from './layout.effects';
export * from './affiliate.effects';

export const HOME_EFFECTS = [LayoutEffects, AffiliateEffects];
