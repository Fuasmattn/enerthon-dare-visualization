import React, { useContext, useState } from 'react';
import ReactMapGL from 'react-map-gl';
import { ActionType } from '../../context/types';
import { UIContext } from '../../context/UIStateProvider';
import { Powerplant, PowerplantType } from '../../shared/types';
import { Marker } from '../Marker/Marker';
import { Viewport } from './types';

const biogasResource: Powerplant = {
  id: 'biooo',
  type: PowerplantType.BIOGAS,
  name: "Bio boss",
  location: {
    latitude: 50,
    longitude: 9
  },
  max_power: 10,
  min_power: 0.0,
  state: {
    ist: 2.5,
    potential_plus: 6.0,
    potential_minus: 2.0
  }
};

const waterResource: Powerplant = {
  id: 'wind',
  type: PowerplantType.WIND,
  name: "wind wonder",
  location: {
    latitude: 50.88,
    longitude: 9.1
  },
  max_power: 2.0,
  min_power: 0.0,
  state: {
    ist: 1.0,
    potential_plus: 0.5,
    potential_minus: 1.0
  }
};

const sunResource: Powerplant = {
  id: 'sun',
  type: PowerplantType.SOLAR,
  name: "super solar",
  location: {
    latitude: 50.4,
    longitude: 9.14
  },
  max_power: 2.0,
  min_power: 0.0,
  state: {
    ist: 1.0,
    potential_plus: 0.5,
    potential_minus: 0.75
  }
};

const initialViewport: Viewport = {
  latitude: 50,
  longitude: 9,
  zoom: 8,
};

export const Map: React.FC = () => {
  const [viewport, setViewport] = useState(initialViewport);
  const { dispatch } = useContext(UIContext);

  const __dispatch = (powerplant: Powerplant) => dispatch({ type: ActionType.SELECT_RESOURCE, payload: powerplant })

  return (
    <ReactMapGL
      {...viewport}
      width="100%"
      height="100%"
      mapboxApiAccessToken="pk.eyJ1Ijoic2ltb25zdGVpbmhlYmVyIiwiYSI6ImNqcjd4N2RvdDAwczY0NHM3cDFndG1zamcifQ.U15J9NVbO3Xs22W4bTYmnw"
      onViewportChange={(viewport: Viewport) => setViewport(viewport)}
    >
      <Marker
        onClick={__dispatch}
        powerplant={biogasResource}
      />
      <Marker
        onClick={__dispatch}
        powerplant={waterResource}
      />
      <Marker
        onClick={__dispatch}
        powerplant={sunResource}
      />
    </ReactMapGL>
  );
};
