import { Action } from '@ngrx/store';
import {BankAccount, CreditCard, EcheckForm, SubscriberAddress, VenueItem} from '@snowl/base-app/model';
import {PaymentMethod, RedeemCouponResponse} from '@snowl/base-app/user';
import { Country } from '@snowl/base-app/model/country';
import {HttpErrorResponse} from '@angular/common/http';
import {ShoutErrorResponse} from '@snowl/base-app/error';

const LOAD_VENUE_ITEMS = '[Wallet] load venue items';
const LOAD_VENUE_ITEMS_SUCCESS = '[Wallet] load venue items success';
const LOAD_VENUE_ITEMS_FAIL = '[Wallet] load venue items fail';

export class LoadVenueItemsAction implements Action {
  static readonly type = LOAD_VENUE_ITEMS;
  readonly type = LOAD_VENUE_ITEMS;
}

export class LoadVenueItemsSuccessAction implements Action {
  static readonly type = LOAD_VENUE_ITEMS_SUCCESS;
  readonly type = LOAD_VENUE_ITEMS_SUCCESS;

  constructor(public payload: VenueItem[]) {}
}

export class LoadVenueItemsFailAction implements Action {
  static readonly type = LOAD_VENUE_ITEMS_FAIL;
  readonly type = LOAD_VENUE_ITEMS_FAIL;

  constructor(public payload: any) {}
}

const LOAD_CREDIT_CARDS = '[Wallet] load credit cards';
const LOAD_CREDIT_CARDS_SUCCESS = '[Wallet] load credit cards success';

export class LoadCreditCardsAction implements Action {
  static readonly type = LOAD_CREDIT_CARDS;
  readonly type = LOAD_CREDIT_CARDS;
}

export class LoadCreditCardsSuccessAction implements Action {
  static readonly type = LOAD_CREDIT_CARDS_SUCCESS;
  readonly type = LOAD_CREDIT_CARDS_SUCCESS;

  constructor(public payload: CreditCard[]) {}
}

const PURCHASE_ITEM = '[Wallet] purchase item';
const PURCHASE_ITEM_SUCCESS = '[Wallet] purchase item success';
const PURCHASE_ITEM_FAIL = '[Wallet] purchase item fail';

export class PurchaseItemAction implements Action {
  static readonly type = PURCHASE_ITEM;
  readonly type = PURCHASE_ITEM;
  constructor(public payload: { method: PaymentMethod; item: VenueItem }) {}
}

export class PurchaseItemSuccessAction implements Action {
  static readonly type = PURCHASE_ITEM_SUCCESS;
  readonly type = PURCHASE_ITEM_SUCCESS;
}

export class PurchaseItemFailAction implements Action {
  static readonly type = PURCHASE_ITEM_FAIL;
  readonly type = PURCHASE_ITEM_FAIL;

  constructor(public payload: any) {}
}

const LOAD_COUNTRIES_SUCCESS = '[Wallet] Load countries success';
export class LoadCountriesSuccessAction implements Action {
  static readonly type = LOAD_COUNTRIES_SUCCESS;
  readonly type = LOAD_COUNTRIES_SUCCESS;

  constructor(public payload: Country[]) {}
}

const LOAD_BILLING_ADDRESSES = '[Wallet] Load billing addresses';
const LOAD_BILLING_ADDRESSES_SUCCESS = '[Wallet] Load billing addresses Success';
const LOAD_BILLING_ADDRESSES_FAIL = '[Wallet] Load billing addresses Fail';
export class LoadBillingAddressesAction implements Action {
  static readonly type = LOAD_BILLING_ADDRESSES;
  readonly type = LOAD_BILLING_ADDRESSES;
}
export class LoadBillingAddressesFailAction implements Action {
  static readonly type = LOAD_BILLING_ADDRESSES_FAIL;
  readonly type = LOAD_BILLING_ADDRESSES_FAIL;
  constructor(public payload: any) {}
}
export class LoadBillingAddressesSuccessAction implements Action {
  static readonly type = LOAD_BILLING_ADDRESSES_SUCCESS;
  readonly type = LOAD_BILLING_ADDRESSES_SUCCESS;
  constructor(public payload: SubscriberAddress[]) {}
}

const LOAD_BANK_ACCOUNTS = '[Wallet] Load bank accounts';
const LOAD_BANK_ACCOUNTS_SUCCESS = '[Wallet] Load bank accounts Success';
const LOAD_BANK_ACCOUNTS_FAIL = '[Wallet] Load bank accounts Fail';
export class LoadBankAccountsAction implements Action {
  static readonly type = LOAD_BANK_ACCOUNTS;
  readonly type = LOAD_BANK_ACCOUNTS;
}
export class LoadBankAccountsFailAction implements Action {
  static readonly type = LOAD_BANK_ACCOUNTS_FAIL;
  readonly type = LOAD_BANK_ACCOUNTS_FAIL;
  constructor(public payload: any) {}
}
export class LoadBankAccountsSuccessAction implements Action {
  static readonly type = LOAD_BANK_ACCOUNTS_SUCCESS;
  readonly type = LOAD_BANK_ACCOUNTS_SUCCESS;
  constructor(public payload: BankAccount[]) {}
}

const WITHDRAW_MONEY = '[Wallet] Withdraw Money';
const WITHDRAW_MONEY_SUCCESS = '[Wallet] Withdraw Money Success';
const WITHDRAW_MONEY_FAIL = '[Wallet] Withdraw Money Fail';
export class WithdrawMoneyAction implements Action {
  static readonly type = WITHDRAW_MONEY;
  readonly type = WITHDRAW_MONEY;
  constructor(public payload: {amount: number, echeck: EcheckForm}) {}
}
export class WithdrawMoneySuccessAction implements Action {
  static readonly type = WITHDRAW_MONEY_SUCCESS;
  readonly type = WITHDRAW_MONEY_SUCCESS;
}
export class WithdrawMoneyFailAction implements Action {
  static readonly type = WITHDRAW_MONEY_FAIL;
  readonly type = WITHDRAW_MONEY_FAIL;
  constructor(public payload: any) {}
}

const REDEEM_COUPON = '[Wallet] Redeem Coupon';
const REDEEM_COUPON_SUCCESS = '[Wallet] Redeem Coupon Success';
const REDEEM_COUPON_FAIL = '[Wallet] Redeem Coupon Fail';
export class RedeemCouponAction implements Action {
  static readonly type = REDEEM_COUPON;
  readonly type = REDEEM_COUPON;
  constructor(public payload: string) {}
}
export class RedeemCouponSuccessAction implements Action {
  static readonly type = REDEEM_COUPON_SUCCESS;
  readonly type = REDEEM_COUPON_SUCCESS;
}
export class RedeemCouponFailAction implements Action {
  static readonly type = REDEEM_COUPON_FAIL;
  readonly type = REDEEM_COUPON_FAIL;
  constructor(public payload: ShoutErrorResponse<RedeemCouponResponse>) {}
}

export type WalletActions =
  | LoadVenueItemsAction
  | LoadVenueItemsFailAction
  | LoadVenueItemsSuccessAction
  | LoadCreditCardsAction
  | LoadCreditCardsSuccessAction
  | PurchaseItemAction
  | PurchaseItemFailAction
  | PurchaseItemSuccessAction
  | LoadCountriesSuccessAction
  | LoadBillingAddressesAction
  | LoadBillingAddressesFailAction
  | LoadBillingAddressesSuccessAction
  | LoadBankAccountsAction
  | LoadBankAccountsFailAction
  | LoadBankAccountsSuccessAction
  | WithdrawMoneyAction
  | WithdrawMoneySuccessAction
  | WithdrawMoneyFailAction
  | RedeemCouponAction
  | RedeemCouponFailAction
  | RedeemCouponSuccessAction;
