import { getUserState } from '@snowl/user-store/reducers';
import { createSelector } from '@ngrx/store';

export const getEditUserState = createSelector(getUserState, state => state.editUser);
export const getIsUploadingImage = createSelector(getEditUserState, state => state.uploadingImage);

export const geteditingState = createSelector(getEditUserState, state => state.editingState);
export const geteditingError = createSelector(getEditUserState, state => state.editingError);

export const getIsVerifyingCode = createSelector(getEditUserState, state => state.verifyingCode);
