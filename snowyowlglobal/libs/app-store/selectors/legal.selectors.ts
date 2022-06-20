import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LegalState } from '@snowl/app-store/reducers';

export const getLegal = createFeatureSelector<LegalState>('legal');

export const getTermsDoc = createSelector(getLegal, legal => legal.termsDoc);
export const getPrivacyDoc = createSelector(getLegal, legal => legal.privacyDoc);

export const getIsTermsLoading = createSelector(getLegal, legal => legal.loadingTermsDoc);
export const getIsPrivacyLoading = createSelector(getLegal, legal => legal.loadingPrivacyDoc);
