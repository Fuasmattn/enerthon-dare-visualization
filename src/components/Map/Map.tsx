import React, { useContext, useState } from 'react';
import ReactMapGL from 'react-map-gl';
import { DataContext } from '../../context/DataProvider';
import { ActionType, Tick } from '../../context/types';
import { UIContext } from '../../context/UIStateProvider';
import { masterData, plantTypeMapping } from '../../shared/data';
import { PlantMaster, Powerplant } from '../../shared/types';
import { Marker } from '../Marker/Marker';
import { Viewport } from './types';

// const biogasResource: Powerplant = {
//   id: 'biooo',
//   type: PowerplantType.BIOGAS,
//   name: 'Bio boss',
//   location: {
//     latitude: 50,
//     longitude: 9,
//   },
//   max_power: 10,
//   min_power: 0.0,
//   state: {
//     ist: 2.5,
//     potential_plus: 6.0,
//     potential_minus: 2.0,
//   },
// };

// const waterResource: Powerplant = {
//   id: 'wind',
//   type: PowerplantType.WIND,
//   name: 'wind wonder',
//   location: {
//     latitude: 50.88,
//     longitude: 9.1,
//   },
//   max_power: 2.0,
//   min_power: 0.0,
//   state: {
//     ist: 1.0,
//     potential_plus: 0.5,
//     potential_minus: 1.0,
//   },
// };

// const sunResource: Powerplant = {
//   id: 'sun',
//   type: PowerplantType.SOLAR,
//   name: 'super solar',
//   location: {
//     latitude: 50.4,
//     longitude: 9.14,
//   },
//   max_power: 2.0,
//   min_power: 0.0,
//   state: {
//     ist: 1.0,
//     potential_plus: 0.5,
//     potential_minus: 0.75,
//   },
// };

const parsePower = (power: string): number => {
  const numberAsString = power.replace(' kW', '');
  const parsedPower = parseFloat(numberAsString);

  return parsedPower / 1000;
};

const enrichTick = (tick: Tick): Powerplant[] => {
  let powerplants: Powerplant[] = [];
  tick.PowerPlants.forEach((powerplant) => {
    const plantMaster: PlantMaster = masterData[powerplant.name];

    powerplants = [
      ...powerplants,
      {
        id: plantMaster.Klarname,
        type: plantTypeMapping[plantMaster.Energietraeger],
        name: plantMaster.KlarnameTR,
        location: {
          latitude: plantMaster.Latitude,
          longitude: plantMaster.Longitude,
        },
        max_power: parsePower(plantMaster.Nettonennleistung),
        min_power: 0.0,
        state: {
          ist: powerplant.ist,
          potential_plus: powerplant.pot_plus,
          potential_minus: powerplant.pot_minus,
          command: powerplant.command,
        },
      },
    ];
  });

  return powerplants;
};

const initialViewport: Viewport = {
  latitude: 50,
  longitude: 9,
  zoom: 8,
};

export const Map: React.FC = () => {
  const [viewport, setViewport] = useState(initialViewport);
  const {
    dispatch,
    state: { privacyMode },
  } = useContext(UIContext);
  const {
    data: { tickData },
  } = useContext(DataContext);

  const powerplants = enrichTick(tickData[tickData.length - 1]);

  const __dispatch = (powerplant: Powerplant) =>
    !privacyMode && dispatch({ type: ActionType.SELECT_RESOURCE, payload: powerplant });

  return (
    <ReactMapGL
      {...viewport}
      width="100%"
      height="100%"
      // mapStyle="mapbox://styles/mapbox/dark-v8"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={(viewport: Viewport) => setViewport(viewport)}
    >
      {powerplants.map((powerplant, i) => {
        return <Marker key={`${powerplant.name}-${i}`} onClick={__dispatch} powerplant={powerplant} />;
      })}
    </ReactMapGL>
  );
};
