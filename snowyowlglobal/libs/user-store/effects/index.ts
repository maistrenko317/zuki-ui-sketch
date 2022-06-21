import { UserEffects } from '@snowl/user-store/effects/edit-user.effects';
import { WalletEffects } from '@snowl/user-store/effects/wallet.effects';

export * from './edit-user.effects';
export * from './wallet.effects';

export const USER_EFFECTS = [UserEffects, WalletEffects];
