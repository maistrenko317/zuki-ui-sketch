import {Injectable} from '@angular/core';
import {AddAddressResponse, BaseHttpService, BaseSubscriberService} from '@snowl/base-app/shared';
import {from, Observable, of, zip} from 'rxjs';
import {BankAccount, CardData, CreditCard, EcheckForm, ShoutResponse, VenueItem} from '@snowl/base-app/model';
import {catchError, map, switchMap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {BTClient, client} from 'braintree-web';
import {select, Store} from "@ngrx/store";
import {getSubscriber} from "@snowl/app-store/selectors";
import {Err, Ok, Result, Results} from 'ts-results';
import {ShoutErrorResponse} from '@snowl/base-app/error';
import {elseMapTo, resultMap, resultMergeMap, resultSwitchMap} from 'ts-results/rxjs-operators';
import {getValue} from '@snowl/base-app/util';

const CLIENT_KEY = '222MG873znw2dXMW29f3TGNa97BTzM2fL3jYycd5e8C7TAWx3f4x9g3bSgWUKhee';
const API_LOGIN_ID = '2bX5V6pXaV';

@Injectable()
export class BasePaymentService {
  private client?: BTClient;
  private subscriber$ = this.store.pipe(select(getSubscriber));

  constructor(
    protected http: BaseHttpService,
    protected httpClient: HttpClient,
    protected subscriberService: BaseSubscriberService,
    protected store: Store<any>
  ) {
  }

  getItemsForVenue(): Observable<Result<VenueItem[], ShoutErrorResponse<VenueItemResponse>>> {
    return this.http
      .sendCollectorRequest<VenueItemResponse>('/store/getItemsForVenue', {
        venue: 'tv.shout.snowyowl'
      })
      .pipe(resultMap(resp =>
        resp.items.sort((a, b) => (+a.price > +b.price ? 1 : -1))
      ));
  }

  // TODO: better error handling
  purchase(item: VenueItem, method: PaymentMethod): Observable<Result<any, any>> {
    if (method instanceof EcheckForm) {
      return this.purchaseUsingEcheck(method, item.uuid);
    }
    if (method instanceof CardData) {
      return this.purchaseUsingCardData(method, item.uuid)
    } else {
      return this.purchaseUsingPaymentMethod(method.externalRefId, item.uuid);
    }
  }

  queryRoutingNumber(number: string): Observable<string | undefined> {
    return this.httpClient
      .jsonp<{ customer_name: string }>(
        'https://www.routingnumbers.info/api/data.json?rn=' + encodeURIComponent(number),
        'callback'
      )
      .pipe(
        map(resp => (resp ? resp.customer_name : undefined)),
        catchError(() => of(undefined))
      );
  }

  loadBankAccounts(): Observable<Result<BankAccount[], ShoutErrorResponse<LoadAccountsResponse>>> {
    return this.http
      .sendCollectorRequest<LoadAccountsResponse>('/store/bankAccount/retrieve')
      .pipe(
        resultMap(resp => resp.accounts)
      );
  }

  getStoredCards(): Observable<CreditCard[]> {
    return this.http.sendCollectorRequest<StoredCardsResponse>('/store/braintree/getPaymentMethods').pipe(
      resultMap(resp => resp.paymentMethods),
      elseMapTo([])
    );
  }

  private purchaseUsingEcheck(echeck: EcheckForm, itemUuid: string): Observable<Result<ShoutResponse, ShoutErrorResponse<AddAddressResponse | AddAccountResponse | ShoutResponse>>> {
    const addressObs = this.addAddressFromEcheckForm(echeck);

    const bankObs = this.createBankAccountFromEcheckForm(echeck);

    return zip(addressObs, bankObs).pipe(
      map(([addressResp, accountResp]) => Results(addressResp, accountResp)),
      resultMergeMap(([addressId, accountId]) => {
        const phone = echeck.phone.replace(/[^\d]/g, '');

        // TODO: what is the response type here?
        return this.http.sendCollectorRequest('/store/purchaseItemViaACH', {itemUuid, accountId, addressId, phone});
      })
    );
  }

  public withdrawUsingEcheck(echeck: EcheckForm, amount: number): Observable<Result<ShoutResponse, ShoutErrorResponse<AddAddressResponse | AddAccountResponse | ShoutResponse>>> {
    const addressObs = this.addAddressFromEcheckForm(echeck);

    const bankObs = this.createBankAccountFromEcheckForm(echeck);

    return zip(addressObs, bankObs).pipe(
      map(([addressResp, accountResp]) => Results(addressResp, accountResp)),
      resultSwitchMap(([addressId, accountId]) => {
        const phone = echeck.phone.replace(/[^\d]/g, '');
        return this.http.sendCollectorRequest('/store/redeemViaACH', {amount, accountId, addressId, phone});
      })
    );
  }

  public redeemCoupon(couponCode: string): Observable<Result<RedeemCouponResponse, ShoutErrorResponse>> {
    return this.http.sendCollectorRequest('/store/coupon/redeem', {couponCode});
  }

  private createBankAccount(account: BankAccount): Observable<Result<string, ShoutErrorResponse<AddAccountResponse>>> {
    return this.http
      .sendCollectorRequest<AddAccountResponse>('/store/bankAccount/create', {account: JSON.stringify(account)})
      .pipe(resultMap(resp => resp.account.id));
  }

  private purchaseUsingCardData(card: CardData, itemUuid: string): Observable<Result<any, any>> {
    const sub = getValue(this.subscriber$)!;

    return card.saveForLater ?
      this.getBraintreeNonce(card).pipe(
        resultSwitchMap((nonce) => this.storeCreditCard(nonce, card.firstname!, card.lastname!)),
        resultSwitchMap(token => this.purchaseUsingPaymentMethod(token, itemUuid))
      )
      : this.getBraintreeNonce(card).pipe(
        resultSwitchMap(nonce => this.purchaseViaNonce(nonce, itemUuid, card.firstname!, card.lastname!))
      );
  }

  private purchaseUsingPaymentMethod(paymentMethodToken: string, itemUuid: string): Observable<Result<ShoutResponse, ShoutErrorResponse>> {
    return this.http.sendCollectorRequest('/store/braintree/purchaseViaPaymentMethod', {paymentMethodToken, itemUuid});
  }

  private storeCreditCard(nonce: string, firstname: string, lastname: string): Observable<Result<string, ShoutErrorResponse<AddPaymentMethodResponse>>> {
    return this.http.sendCollectorRequest<AddPaymentMethodResponse>('/store/braintree/addPaymentMethod', {
      nonce,
      firstname,
      lastname
    }).pipe(
      resultMap(resp => resp.paymentMethodToken)
    );
  }

  private getBraintreeNonce(card: CardData): Observable<Result<string, any>> {
    return this.getClient().pipe(
      resultSwitchMap(clientInstance => {
        // TODO: what if this is an error?  Do I need to use catcherror for this promise?
        return from(clientInstance.request({
          endpoint: 'payment_methods/credit_cards',
          method: 'post',
          data: {
            creditCard: {
              number: card.cardNumber,
              cvv: card.cardCode!,
              expirationMonth: card.month!,
              expirationYear: card.year!,
              cardholderName: `${card.firstname} ${card.lastname}`,
              billingAddress: {
                postalCode: card.zip!
              },
              // options: {
              //   validate: true
              // }
            }
          }
        }))
      }),
      resultMap(response => response.creditCards[0].nonce)
    );
  }

  private getClient(): Observable<Result<BTClient, any>> {
    if (this.client) {
      return of(Ok(this.client));
    } else {
      return this.http.sendCollectorRequest<ClientTokenResponse>('/store/braintree/getClientToken').pipe(
        resultMap(resp => resp.clientToken),
        resultSwitchMap((clientToken) => {
            // TODO: What errors can happen? I'd like to get typed errors here.
            return from(client.create({
              authorization: clientToken
            })).pipe(
              map(item => Ok(item)),
              catchError(err => of(Err(err)))
            );
        })
      )
    }
  }

  // TODO: again, what errors can happen here?
  private purchaseViaNonce(nonce: string, itemUuid: string, firstname: string, lastname: string): Observable<Result<ShoutResponse, ShoutErrorResponse>> {
    return this.http.sendCollectorRequest('/store/braintree/purchaseViaNonce', {nonce, itemUuid, firstname, lastname});
  }

  private addAddressFromEcheckForm(echeck: EcheckForm): Observable<Result<number, ShoutErrorResponse<AddAddressResponse>>> {
    return echeck.address.addressId
      ? of(Ok(echeck.address.addressId))
      : this.subscriberService.addSubscriberAddress(echeck.address);
  }

  private createBankAccountFromEcheckForm(echeck: EcheckForm): Observable<Result<string, ShoutErrorResponse<AddAccountResponse>>> {
    return echeck.bank.id
      ? of(Ok(echeck.bank.id))
      : this.createBankAccount(echeck.bank);
  }
}

export type PaymentMethod = CreditCard | CardData | EcheckForm;

interface ClientTokenResponse extends ShoutResponse {
  clientToken: string;
}

interface StoredCardsResponse extends ShoutResponse {
  paymentMethods: CreditCard[];
}

interface AddPaymentMethodResponse extends ShoutResponse {
  paymentMethodToken: string;
}

interface VenueItemResponse extends ShoutResponse {
  items: VenueItem[];
}

interface AddAccountResponse extends ShoutResponse {
  account: BankAccount;
}

interface LoadAccountsResponse extends ShoutResponse {
  accounts: BankAccount[];
}

interface IAccept {
  dispatchData(secureData: SecureData, callback: (resp: DispatchResponse) => void): void;
}

interface SecureData {
  authData: AuthData;
  cardData: CardData;
}

interface AuthData {
  clientKey: string;
  apiLoginID: string;
}

interface DispatchResponse {
  messages: {
    resultCode: string;
    message: Array<{ code: string; text: string }>;
  };
  opaqueData: {
    dataDescriptor: string;
    dataValue: string;
  };
}

declare let Accept: IAccept;

export interface RedeemCouponResponse extends ShoutResponse<'couponExpired' | 'couponAlreadyRedeemed' | 'couponCancelled'> {
}
