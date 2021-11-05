import * as React from 'react';
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


const get_icon = (icon_type: PowerplantType) => {
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
}

const get_image_style = (viewport: WebMercatorViewport | undefined) => {
  if (!viewport) {
    return { width: '0px', height: '0px'}; 
  }

  if (viewport.zoom > ZOOM_BORDER) {
    return { width: '100px', height: '100px'}; 
  } else {
    return { width: '50px', height: '50px'}; 
  }
}

const get_detail_style = (viewport: WebMercatorViewport | undefined) => {
  if (!viewport) {
    return {opacity: 0}
  }

  if (viewport.zoom > ZOOM_BORDER) {
    return { opacity: 1 }; 
  } else {
    return { opacity: 0 }; 
  }
}

export const Marker: React.FC<MarkerProps> = ({ powerplant, onClick }) => {
  const context = React.useContext(MapContext);
  const prev_powerplant = usePrevious(powerplant)

  const [x, y] = context.viewport ? context.viewport.project([powerplant.location.longitude, powerplant.location.latitude]) : [0, 0];

  const markerStyle: React.CSSProperties = {
    left: x,
    top: y,
  };

  const icon = get_icon(powerplant.type)
  const image_style = get_image_style(context.viewport)
  const detail_style = get_detail_style(context.viewport)

  

  //TODO: define optimal zoom level
  return (
    <div onClick={() => onClick(powerplant)} className="position-absolute d-flex flex-row" style={markerStyle}>
      <div className="position-relative align-center" style={{width: '100px', height: '100px'}}>
        <motion.div className="p-2 position-absolute" animate={image_style}>
          <img
            src={icon} 
            alt={powerplant.type} 
            style={{width: '100%', height: '100%'}}
          />
        </motion.div>
        <LoadingCircle className="position-absolute" radius={"120px"} color={"green"} strokeWidth="10px" />

        
        {/* <AnimatePresence>
          {(context.viewport && context.viewport.zoom > ZOOM_BORDER) && (
            <motion.div
              className="text-center"
              animate={detail_style}
            >
              {powerplant.name}
            </motion.div>  
          )} 
        </AnimatePresence> */}
      </div>
      <AnimatePresence>
        {(context.viewport && context.viewport.zoom > ZOOM_BORDER) && (
          <motion.div animate={detail_style}>
            <PowerState max_power={powerplant.max_power} min_power={powerplant.min_power} state={powerplant.state} />
          </motion.div>
        )}
      </AnimatePresence>
      {/* <div>
        Now: {powerplant.state.command}, Prev: {prev_powerplant?.state.command}
      </div> */}
      <FillCircle radius={"50px"} color={"green"} strokeWidth="10px"/>
    </div>
  );
};
