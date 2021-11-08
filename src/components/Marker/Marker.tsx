import React, { useEffect, useState } from 'react';
import CSSTransition from 'react-transition-group';
import { MapContext, WebMercatorViewport } from 'react-map-gl';
import { AnimatePresence, motion } from 'framer-motion';
import { MarkerProps } from './types';
import { Powerplant, PowerplantType } from '../../shared/types';

import Solar from '../../assets/icons/solar.svg';
import Wind from '../../assets/icons/wind.svg';
import Biogas from '../../assets/icons/biogas.svg';
import { PowerState } from './PowerState';
import { usePrevious } from '../../hooks/usePrevious';
import { FillCircle, LoadingCircle } from './Spinner/Spinner';
import { useDelayUnmount } from '../../hooks/useDelayUnmount';

const ZOOM_BORDER = 11.9;

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

const getImageStyle = (viewport: WebMercatorViewport | undefined) => {
  if (!viewport) {
    return { width: '0px', height: '0px' };
  }

  if (viewport.zoom > ZOOM_BORDER) {
    return { width: '70px', height: '70px' };
  } else {
    return { width: '50px', height: '50px' };
  }
};

const getDetailStyle = (viewport: WebMercatorViewport | undefined) => {
  if (!viewport) {
    return { opacity: 0 };
  }

  if (viewport.zoom > ZOOM_BORDER) {
    return { opacity: 1 };
  } else {
    return { opacity: 0 };
  }
};

const getSpinnerStyle = (imageStyle: { width: string; height: string }) => {
  const widthNumber = parseInt(imageStyle.width.replace('px', ''));
  const heightNumber = parseInt(imageStyle.width.replace('px', ''));

  const _spinnerRadius = (Math.max(widthNumber, heightNumber) / Math.sqrt(2)) * 2;
  return {
    radius: _spinnerRadius + 'px',
    strokeWidth: widthNumber / 10 + 'px',
  };
};

const getRedispatchAmountLable = (powerplant: Powerplant) => {
  return (
    <div
      className="position-absolute top-100 start-50 translate-middle-x d-flex flex-row justify-content-around align-items-center"
      style={{
        marginTop: '30px',
        width: '90px',
        height: '40px',
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: '12%',
      }}
    >
      <svg width="10px" height="100%" viewBox="0 0 10 100">
        <defs>
          <marker id="redispatch-arrow" markerWidth="13" markerHeight="13" refX="2" refY="6" orient="auto">
            <path d="M2,1 L2,7.5 L5,6 L2,4.5" style={{ fill: 'green' }} />
          </marker>
        </defs>
        {powerplant.state.command && powerplant.state.command > 0 ? (
          <line x1="5" y1="90" x2="5" y2="40" markerEnd="url(#redispatch-arrow)" strokeWidth="10px" stroke="green" />
        ) : (
          <line x1="5" y1="10" x2="5" y2="60" markerEnd="url(#redispatch-arrow)" strokeWidth="10px" stroke="green" />
        )}
      </svg>
      <div>{powerplant.state.command?.toFixed(2)} MW</div>
    </div>
  );
};

export const Marker: React.FC<MarkerProps> = ({ powerplant, onClick }) => {
  const context = React.useContext(MapContext);
  const prev_powerplant = usePrevious(powerplant);

  const [x, y] = context.viewport
    ? context.viewport.project([powerplant.location.longitude, powerplant.location.latitude])
    : [0, 0];

  const markerStyle: React.CSSProperties = {
    left: x,
    top: y,
  };

  const icon = getIcon(powerplant.type);
  const imageStyle = getImageStyle(context.viewport);
  const detailStyle = getDetailStyle(context.viewport);
  const spinnerStyle = getSpinnerStyle(imageStyle);

  const dispatchRequestPending = powerplant.state.command !== 0;
  const dispatchRunning =
    powerplant.state.command !== prev_powerplant?.state.command && prev_powerplant?.state.command !== 0;
  const dispatchRunningDelay = useDelayUnmount(dispatchRunning, 3000);

  return (
    <div onClick={() => onClick(powerplant)} className="position-absolute d-flex flex-row align-items-center" style={markerStyle}>
      <div className="position-relative align-center" style={imageStyle}>
        <motion.div className="p-2 position-absolute" animate={imageStyle}>
          <img src={icon} alt={powerplant.type} style={{ width: '100%', height: '100%' }} />
        </motion.div>
        {dispatchRequestPending && (
          <div className="position-absolute top-50 start-50 translate-middle">
            <LoadingCircle radius={spinnerStyle.radius} color={'green'} strokeWidth={spinnerStyle.strokeWidth} />
          </div>
        )}
        {dispatchRequestPending && getRedispatchAmountLable(powerplant)}
        {dispatchRunningDelay && (
          <div className="position-absolute top-50 start-50 translate-middle">
            <FillCircle radius={spinnerStyle.radius} color={'green'} strokeWidth={spinnerStyle.strokeWidth} />
          </div>
        )}
      </div>

      <AnimatePresence>
        {context.viewport && context.viewport.zoom > ZOOM_BORDER && (
          <motion.div style={{ marginLeft: '25px' }} animate={detailStyle}>
            <PowerState max_power={powerplant.max_power} min_power={powerplant.min_power} state={powerplant.state} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
