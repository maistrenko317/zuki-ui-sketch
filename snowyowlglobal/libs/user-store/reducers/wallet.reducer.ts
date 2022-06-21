import {BankAccount, CreditCard, SubscriberAddress, VenueItem} from '@snowl/base-app/model';
import { ActionReducer } from '@ngrx/store';
import {
  LoadBankAccountsFailAction,
  LoadBankAccountsSuccessAction,
  LoadBillingAddressesFailAction,
  LoadBillingAddressesSuccessAction,
  LoadCountriesSuccessAction,
  LoadCreditCardsSuccessAction,
  LoadVenueItemsAction,
  LoadVenueItemsFailAction,
  LoadVenueItemsSuccessAction,
  PurchaseItemAction,
  PurchaseItemFailAction,
  PurchaseItemSuccessAction,
  RedeemCouponAction,
  RedeemCouponFailAction,
  RedeemCouponSuccessAction,
  WalletActions,
  WithdrawMoneyAction,
  WithdrawMoneyFailAction,
  WithdrawMoneySuccessAction
} from '@snowl/user-store/actions/wallet.actions';
import { Country } from '@snowl/base-app/model/country';

export interface WalletState {
  venueItems: VenueItem[];
  loadingVenueItems: boolean;
  creditCards: CreditCard[];
  purchasing: boolean;
  countries: Country[];
  billingAddresses: SubscriberAddress[];
  bankAccounts: BankAccount[];
  withdrawingMoney: boolean;
  redeemingCoupon: boolean;
}
const defaultState: WalletState = {
  venueItems: [],
  loadingVenueItems: false,
  purchasing: false,
  countries: [],
  creditCards: [],
  billingAddresses: [],
  bankAccounts: [],
  withdrawingMoney: false,
  redeemingCoupon: false
};

export function walletReducer(state = defaultState, action: WalletActions): WalletState {
  switch (action.type) {
    case LoadVenueItemsAction.type:
      return {
        ...state,
        loadingVenueItems: true
      };
    case LoadVenueItemsFailAction.type:
      return {
        ...state,
        loadingVenueItems: false
      };
    case LoadVenueItemsSuccessAction.type:
      return {
        ...state,
        loadingVenueItems: false,
        venueItems: action.payload
      };
    case PurchaseItemAction.type:
      return {
        ...state,
        purchasing: true
      };
    case PurchaseItemFailAction.type:
    case PurchaseItemSuccessAction.type:
      return {
        ...state,
        purchasing: false
      };
    case LoadCountriesSuccessAction.type:
      return {
        ...state,
        countries: action.payload
      };
    case LoadBillingAddressesFailAction.type:
      return {
        ...state,
        billingAddresses: []
      };
    case LoadBillingAddressesSuccessAction.type:
      return {
        ...state,
        billingAddresses: action.payload
      };
    case LoadBankAccountsFailAction.type:
      return {
        ...state,
        bankAccounts: []
      };
    case LoadBankAccountsSuccessAction.type:
      return {
        ...state,
        bankAccounts: action.payload
      };
    case WithdrawMoneyAction.type:
      return {
        ...state,
        withdrawingMoney: true
      };
    case WithdrawMoneyFailAction.type:
    case WithdrawMoneySuccessAction.type:
      return {
        ...state,
        withdrawingMoney: false
      };
    case LoadCreditCardsSuccessAction.type:
      return {
        ...state,
        creditCards: action.payload
      };
    case RedeemCouponAction.type:
      return {
        ...state,
        redeemingCoupon: true
      };
    case RedeemCouponFailAction.type:
    case RedeemCouponSuccessAction.type:
      return {
        ...state,
        redeemingCoupon: false
      };
    default:
      return state;
  }
}
