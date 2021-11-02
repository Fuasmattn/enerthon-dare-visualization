import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { UIContext } from '../../context/UIStateProvider';
import { ActionType } from '../../context/types';

export const Timeline: React.FC = () => {
  const { state, dispatch } = useContext(UIContext);

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      exit={{ y: 50 }}
      transition={{ duration: 0.2 }}
      className="bg-white p-3 rounded shadow"
      style={{ height: '100%' }}
    >
      <div className="d-flex justify-content-between">
        <p className="fs-5">DA/RE timeline</p>
        {/* <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={() => dispatch({ type: ActionType.TOGGLE_TIMELINE })}
        ></button> */}
      </div>
    </motion.div>
  );
};
