import { PublicProfile } from '@snowl/base-app/model/public-profile';
import {LoadPublicProfilesSuccessAction, PublicProfileActions} from '@snowl/app-store/actions/public-profile.actions';
import { keyBy } from '@snowl/base-app/util';

export interface PublicProfileState {
  entities: Dict<PublicProfile, number>;
}
const initialState: PublicProfileState = {
  entities: {}
};

export function publicProfileReducer(state = initialState, action: PublicProfileActions): PublicProfileState {
  switch (action.type) {
    case LoadPublicProfilesSuccessAction.type:
      const entities = keyBy(action.payload, 'subscriberId');
      return {
        ...state,
        entities: { ...state.entities, ...entities }
      };
    default:
      return state;
  }
}
