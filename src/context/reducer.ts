import { Action, ActionType, UIState } from './types';

export const reducer = (state: UIState, action: Action) => {
  switch (action.type) {
    case ActionType.DESELECT_RESOURCE:
      return {
        ...state,
        selectedResource: null,
      };
    case ActionType.SELECT_RESOURCE:
      return {
        ...state,
        selectedResource: action.payload,
      };

    case ActionType.TOGGLE_TIMELINE:
      return {
        ...state,
        showTimeline: !state.showTimeline,
      };

    case ActionType.TOGGLE_PRIVACY:
      return {
        ...state,
        privacyMode: !state.privacyMode,
      };

    default:
      return state;
  }
};
