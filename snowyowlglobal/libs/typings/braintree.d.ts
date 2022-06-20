declare module 'braintree-web' {
  export interface BTClient {
    authorization: string;

    create: (opts: {authorization: string}) => Promise<BTClient>;
    request: (opts: BTNonceRequest) => Promise<BTNonceResponse>;
  }

  export interface BTNonceResponse {
    creditCards: {nonce: string}[];
  }

  export interface BTNonceRequest {
    endpoint: string;
    method: string;
    data: {
      creditCard: {
        number: string,
        cvv: string,
        expirationMonth: string,
        expirationYear: string,
        cardholderName: string,
        billingAddress: {
          postalCode: string
        },
        options?: {
          validate: boolean
        }
      }
    }
  }
  export const client: BTClient;
}
