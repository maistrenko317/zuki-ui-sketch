import { BasePlaceService, PlaceAutocomplete } from '@snowl/base-app/user';
import { Observable ,  of ,  Subject } from 'rxjs';
import { SubscriberAddress } from '@snowl/base-app/model';

const autocompleteService = new google.maps.places.AutocompleteService();
const placeService = new google.maps.places.PlacesService(document.createElement('div'));

export class PlaceService extends BasePlaceService {
  placeAutocomplete(query: string): Observable<PlaceAutocomplete[]> {
    const result = new Subject<PlaceAutocomplete[]>();
    autocompleteService.getPlacePredictions({ input: query, types: ['address'] }, resp => {
      result.next(resp as any);
      result.complete();
    });
    return result;
  }

  getSubscriberAddressFromPlace(placeId: string): Observable<SubscriberAddress> {
    const result = new Subject<SubscriberAddress>();
    placeService.getDetails({ placeId }, response => {
      result.next(this.placeDetailToSubscriberAddress(response));
      result.complete();
    });
    return result;
  }
}
