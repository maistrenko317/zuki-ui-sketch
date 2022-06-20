import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubscriberAddress } from '@snowl/base-app/model';
import PlaceResult = google.maps.places.PlaceResult;

export abstract class BasePlaceService {
  abstract placeAutocomplete(query: string): Observable<PlaceAutocomplete[]>;
  abstract getSubscriberAddressFromPlace(placeId: string): Observable<SubscriberAddress>;

  placeDetailToSubscriberAddress(place: PlaceResult): SubscriberAddress {
    const result = new SubscriberAddress();
    for (const component of place.address_components || []) {
      if (component.types.indexOf('country') !== -1) {
        result.countryCode = component.short_name;
      } else if (component.types.indexOf('locality') !== -1) {
        result.city = component.long_name;
      } else if (component.types.indexOf('administrative_area_level_1') !== -1) {
        result.state = component.short_name;
      } else if (component.types.indexOf('postal_code') !== -1) {
        result.zip = component.long_name;
      }
    }
    result.addr1 = place.name;
    return result;
  }
}

export interface PlaceAutocomplete {
  description: string;
  place_id: string;
  matched_substrings: [{ length: number; offset: number }];
}
export interface AutocompleteResponse {
  predictions: PlaceAutocomplete[];
}
