import { editUserReducer, EditUserState } from '@snowl/user-store/reducers/edit-user.reducer';
import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { EditUserActions } from '@snowl/user-store/actions';
import { walletReducer, WalletState } from '@snowl/user-store/reducers/wallet.reducer';
import { WalletActions } from '@snowl/user-store/actions/wallet.actions';

export * from './edit-user.reducer';
export * from './wallet.reducer';

export interface UserState {
  editUser: EditUserState;
  wallet: WalletState;
}

export const userReducers: ActionReducerMap<UserState, any> = {
  editUser: editUserReducer,
  wallet: walletReducer
};

export const getUserState = createFeatureSelector<UserState>('user');
