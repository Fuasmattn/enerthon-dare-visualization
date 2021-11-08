import React, { useContext } from 'react';
import { ActionType } from '../../context/types';
import { UIContext } from '../../context/UIStateProvider';

export const Toolbar = () => {
  const {
    state: { privacyMode, showTimeline },
    dispatch,
  } = useContext(UIContext);
  return (
    <div className="d-flex align-items-center px-2">
      <button
        className="btn btn-small bg-white"
        onClick={() => {
          if (!privacyMode && showTimeline) {
            dispatch({ type: ActionType.DESELECT_RESOURCE });
          }
          dispatch({ type: ActionType.TOGGLE_PRIVACY });
        }}
      >
        {privacyMode ? <i className="bi bi-lock-fill me-2"></i> : <i className="bi bi-unlock-fill me-2"></i>}
        privacy mode: {privacyMode ? 'on' : 'off'}
      </button>
    </div>
  );
};
