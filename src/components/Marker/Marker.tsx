import React from 'react';
import { MapContext, WebMercatorViewport } from 'react-map-gl';
import { AnimatePresence, motion } from 'framer-motion';
import { MarkerProps } from './types';
import { PowerplantType } from '../../shared/types';

import Solar from '../../assets/icons/solar.svg';
import Wind from '../../assets/icons/wind.svg';
import Biogas from '../../assets/icons/biogas.svg';
import { PowerState } from './PowerState';
import { usePrevious } from '../../hooks/usePrevious';
import { FillCircle, LoadingCircle } from './Spinner/Spinner';

const ZOOM_BORDER = 7;


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
    return { width: '100px', height: '100px' };
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

const getSpinnerStyle = (imageStyle: {width: string, height: string}) => {
  const widthNumber = parseInt(imageStyle.width.replace("px", ""))
  const heightNumber = parseInt(imageStyle.width.replace("px", ""))

  const _spinnerRadius = Math.max(widthNumber, heightNumber) / Math.sqrt(2) * 2
  return { 
    radius: _spinnerRadius + "px",
    strokeWidth: (widthNumber / 10) + "px"
  }
}

export const Marker: React.FC<MarkerProps> = ({ powerplant, onClick }) => {
  const context = React.useContext(MapContext);
  const prev_powerplant = usePrevious(powerplant)

  const [x, y] = context.viewport
    ? context.viewport.project([powerplant.location.longitude, powerplant.location.latitude])
    : [0, 0];

  const markerStyle: React.CSSProperties = {
    left: x,
    top: y,
  };

  const icon = getIcon(powerplant.type)
  const imageStyle = getImageStyle(context.viewport)
  const detailStyle = getDetailStyle(context.viewport)
  const spinnerStyle = getSpinnerStyle(imageStyle)

  const dispatchRequestPending = powerplant.state.command !== 0
  const dispatchRunning = (powerplant.state.command !== prev_powerplant?.state.command) && prev_powerplant?.state.command !== 0

  //TODO: define optimal zoom level
  return (
    <div onClick={() => onClick(powerplant)} className="position-absolute d-flex flex-row" style={markerStyle}>
      <div className="position-relative align-center" style={imageStyle}>
        <motion.div className="p-2 position-absolute" animate={imageStyle}>
          <img
            src={icon} 
            alt={powerplant.type} 
            style={{width: '100%', height: '100%'}}
          />
        </motion.div>
        {dispatchRequestPending && (
          <div className="position-absolute top-50 start-50 translate-middle">
            <LoadingCircle radius={spinnerStyle.radius} color={"green"} strokeWidth={spinnerStyle.strokeWidth} />
          </div>
        )}
        {dispatchRunning && (
          <div className="position-absolute top-50 start-50 translate-middle">
            <FillCircle radius={spinnerStyle.radius} color={"green"} strokeWidth={spinnerStyle.strokeWidth} />
          </div>
        )}

      </div>
      <AnimatePresence>
        {(context.viewport && context.viewport.zoom > ZOOM_BORDER) && (
          <motion.div style={{marginLeft: "25px"}} animate={detailStyle}>
            <PowerState max_power={powerplant.max_power} min_power={powerplant.min_power} state={powerplant.state} />
          </motion.div>
        )}
      </AnimatePresence>      
    </div>
  );
};
