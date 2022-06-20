import { ActionReducer } from '@ngrx/store';
import {
  EditUserActions,
  UpdateUserAction, UpdateUserFailAction, UpdateUserSuccessAction,
  UploadProfileImageAction,
  UploadProfileImageFailAction,
  UploadProfileImageSuccessAction, VerifyPhoneNumberAction, VerifyPhoneNumberResponseAction,
} from '@snowl/user-store/actions';

export interface EditUserState {
  uploadingImage: boolean;
  editingState: editingState;
  editingError?: string;
  verifyingCode: boolean;
}
export type editingState = 'DEFAULT' | 'EDITING' | 'EDITED' | 'ERROR';

const initialState: EditUserState = {
  uploadingImage: false,
  editingState: 'DEFAULT',
  verifyingCode: false
};

export function editUserReducer(state = initialState, action: EditUserActions): EditUserState {
  switch (action.type) {
    case UploadProfileImageAction.type:
      return {
        ...state,
        uploadingImage: true
      };
    case UploadProfileImageFailAction.type:
    case UploadProfileImageSuccessAction.type:
      return {
        ...state,
        uploadingImage: false
      };

    case UpdateUserAction.type:
      return {
        ...state,
        editingState: 'EDITING'
      };
    case UpdateUserFailAction.type:
      return {
        ...state,
        editingState: 'ERROR',
        editingError: action.message
      };
    case UpdateUserSuccessAction.type:
      return {
        ...state,
        editingState: 'EDITED',
        editingError: undefined
      };

    case VerifyPhoneNumberAction.type:
      return {
        ...state,
        verifyingCode: true
      };
    case VerifyPhoneNumberResponseAction.type:
      return {
        ...state,
        verifyingCode: false
      };
    default:
      return state;
  }
}
