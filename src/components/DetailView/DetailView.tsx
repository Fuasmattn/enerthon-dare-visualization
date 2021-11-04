import React, { useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ActionType } from '../../context/types';
import { UIContext } from '../../context/UIStateProvider';

export const DetailView: React.FC = () => {
  const { state, dispatch } = useContext(UIContext);
  return (
    <AnimatePresence>
      {state.selectedResource && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="p-4 bg-white shadow"
          style={{ width: '400px', height: '500px' }}
        >
          <div className="d-flex flex-column">
            <div className="d-flex flex-row-reverse">
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => dispatch({ type: ActionType.DESELECT_RESOURCE })}
              ></button>
            </div>
            <p className="d-flex justify-content-between fs-5">Id: {state.selectedResource?.id}</p>
            <p className="d-flex justify-content-between fs-5">Name: {state.selectedResource?.name}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
