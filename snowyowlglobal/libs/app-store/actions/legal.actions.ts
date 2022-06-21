import { Action } from '@ngrx/store';

const LOAD_PRIVACY_DOC = '[Legal] Load privacy doc';
const LOAD_PRIVACY_DOC_SUCCESS = '[Legal] Load privacy doc success';

export class LoadPrivacyDocAction implements Action {
  static readonly type = LOAD_PRIVACY_DOC;
  readonly type = LOAD_PRIVACY_DOC;
}

export class LoadPrivacyDocSuccessAction implements Action {
  static readonly type = LOAD_PRIVACY_DOC_SUCCESS;
  readonly type = LOAD_PRIVACY_DOC_SUCCESS;
  constructor(public payload: string) {}
}

const LOAD_TERMS_DOC = '[Legal] Load terms doc';
const LOAD_TERMS_DOC_SUCCESS = '[Legal] Load terms doc success';

export class LoadTermsDocAction implements Action {
  static readonly type = LOAD_TERMS_DOC;
  readonly type = LOAD_TERMS_DOC;
}

export class LoadTermsDocSuccessAction implements Action {
  static readonly type = LOAD_TERMS_DOC_SUCCESS;
  readonly type = LOAD_TERMS_DOC_SUCCESS;
  constructor(public payload: string) {}
}

export type LegalActions =
  | LoadPrivacyDocAction
  | LoadPrivacyDocSuccessAction
  | LoadTermsDocAction
  | LoadTermsDocSuccessAction;
