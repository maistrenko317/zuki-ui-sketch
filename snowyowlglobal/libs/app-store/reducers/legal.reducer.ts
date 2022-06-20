import {
  LegalActions, LoadPrivacyDocAction, LoadPrivacyDocSuccessAction, LoadTermsDocAction, LoadTermsDocSuccessAction
} from '@snowl/app-store/actions';

export interface LegalState {
  privacyDoc?: string;
  loadingPrivacyDoc: boolean;
  termsDoc?: string;
  loadingTermsDoc: boolean;
}

const defaultState: LegalState = {
  loadingPrivacyDoc: false,
  loadingTermsDoc: false
};

export function legalReducer(state = defaultState, action: LegalActions): LegalState {
  switch (action.type) {
    case LoadPrivacyDocAction.type:
      return {
        ...state,
        loadingPrivacyDoc: true
      };
    case LoadTermsDocAction.type:
      return {
        ...state,
        loadingTermsDoc: true
      };
    case LoadPrivacyDocSuccessAction.type:
      return {
        ...state,
        loadingPrivacyDoc: false,
        privacyDoc: action.payload
      };
    case LoadTermsDocSuccessAction.type:
      return {
        ...state,
        loadingTermsDoc: false,
        termsDoc: action.payload
      };
    default:
      return state;
  }
}
