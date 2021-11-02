import * as React from 'react';
import { MapContext } from 'react-map-gl';
import { MarkerProps } from './types';

export const Marker: React.FC<MarkerProps> = ({ longitude, latitude, resource, onClick }) => {
  const context = React.useContext(MapContext);

  const [x, y] = context.viewport ? context.viewport.project([longitude, latitude]) : [0, 0];

  const markerStyle: React.CSSProperties = {
    left: x,
    top: y,
  };

  return (
    <div onClick={() => onClick(resource)} className="position-absolute d-flex" style={markerStyle}>
      <div>{resource.id}</div>
      <div className="bg-white ms-1 py-3 px-1">U</div>
    </div>
  );
};
