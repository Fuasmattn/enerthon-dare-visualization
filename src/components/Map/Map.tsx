import React, { useContext, useState } from 'react';
import ReactMapGL from 'react-map-gl';
import { ActionType } from '../../context/types';
import { UIContext } from '../../context/UIStateProvider';
import { Resource, ResourceType } from '../../shared/types';
import { Marker } from './Marker';
import { Viewport } from './types';

const biogasResource: Resource = {
  id: 'biooo',
  type: ResourceType.BIOGAS,
};

const waterResource: Resource = {
  id: 'waterrr',
  type: ResourceType.WATER,
};

const initialViewport: Viewport = {
  latitude: 50,
  longitude: 9,
  zoom: 8,
};

export const Map: React.FC = () => {
  const [viewport, setViewport] = useState(initialViewport);
  const { dispatch } = useContext(UIContext);

  return (
    <ReactMapGL
      {...viewport}
      width="100%"
      height="100%"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={(viewport: Viewport) => setViewport(viewport)}
    >
      <Marker
        onClick={() => dispatch({ type: ActionType.SELECT_RESOURCE, payload: biogasResource })}
        resource={biogasResource}
        latitude={50}
        longitude={9}
      />
      <Marker
        onClick={() => dispatch({ type: ActionType.SELECT_RESOURCE, payload: waterResource })}
        resource={waterResource}
        latitude={50.88}
        longitude={9.1}
      />
    </ReactMapGL>
  );
};
