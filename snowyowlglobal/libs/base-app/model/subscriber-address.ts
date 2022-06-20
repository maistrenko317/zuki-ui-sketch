export class SubscriberAddress {
  subscriberId: number;
  addressId: number;
  type = 'BILLING';
  addr1: string;
  addr2: string;
  city: string;
  state = '';
  zip: string;
  countryCode = '';
}
