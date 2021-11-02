import React, { createContext, useReducer } from 'react';
import { UIState, Action } from './types';
import { reducer } from './reducer';

const initialState: UIState = {
  selectedResource: null,
  showTimeline: true,
};

export const UIContext = createContext<{ state: UIState; dispatch: React.Dispatch<Action> }>({
  state: initialState,
  dispatch: () => null,
});

export const UIStateProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <UIContext.Provider value={{ state, dispatch }}>{children}</UIContext.Provider>;
};
