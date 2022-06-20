import {HomeLayoutActions, SelectGameViewAction, SelectHomeTabAction} from '../actions';
import { HomeGameView } from '@snowl/base-app/home';
export interface HomeLayout {
  selectedTab: HomeTab;
  selectedGameView: HomeGameView;
}
let initialLayout: HomeLayout = {
  selectedTab: 'games',
  selectedGameView: 'all'
};

export type HomeTab = 'games' | 'referrals' | 'me';

export function homeLayoutReducer(state = initialLayout, action: HomeLayoutActions): HomeLayout {
  switch (action.type) {
    case SelectHomeTabAction.type:
      initialLayout = { ...initialLayout, selectedTab: action.payload }; // preserves the selected tab on logout
      return {
        ...state,
        selectedTab: action.payload
      };
    case SelectGameViewAction.type:
      return {
        ...state,
        selectedGameView: action.payload
      };
    default:
      return state;
  }
}
