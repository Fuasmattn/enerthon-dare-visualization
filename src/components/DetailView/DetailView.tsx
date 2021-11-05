import React, { useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ActionType } from '../../context/types';
import { UIContext } from '../../context/UIStateProvider';
import { PowerplantType } from '../../shared/types';

import Solar from '../../assets/icons/solar.svg';
import Wind from '../../assets/icons/wind.svg';
import Biogas from '../../assets/icons/biogas.svg';
export const DetailView: React.FC = () => {
  const { state, dispatch } = useContext(UIContext);

  const getIcon = (icon_type: PowerplantType) => {
    switch (icon_type) {
      case PowerplantType.SOLAR:
        return Solar;
      case PowerplantType.WIND:
        return Wind;
      case PowerplantType.BIOGAS:
        return Biogas;
      default:
        throw new Error(`Unknown power plant type ${icon_type}`);
    }
  };
  return (
    <AnimatePresence>
      {state.selectedResource && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="p-4 bg-white shadow rounded"
          style={{ width: '400px' }}
        >
          <div className="d-flex justify-content-between">
            <div className="d-flex align-items-baseline mb-4">
              <img src={getIcon(state.selectedResource.type)} height="24" />
              <p className="text-start fs-4 ms-2 pb-0 mb-0">{state.selectedResource?.name}</p>
            </div>

            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => dispatch({ type: ActionType.DESELECT_RESOURCE })}
            ></button>
          </div>
          <p className="text-start" style={{ fontSize: 15 }}>
            <i className="bi bi-pin-map-fill me-2"></i> {state.selectedResource?.location.latitude},{' '}
            {state.selectedResource?.location.longitude}
          </p>
          <p className="text-start" style={{ fontSize: 15 }}>
            Id: {state.selectedResource?.id}
          </p>
          <p className="text-start" style={{ fontSize: 15 }}>
            Type: {state.selectedResource?.type}
          </p>
          <p className="text-start" style={{ fontSize: 15 }}>
            Current Power: {state.selectedResource?.state.ist} MW
          </p>
          <p className="text-start" style={{ fontSize: 15 }}>
            Potential Up: {state.selectedResource?.state.potential_plus} MW
          </p>
          <p className="text-start" style={{ fontSize: 15 }}>
            Potential Down: {state.selectedResource?.state.potential_minus} MW
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
