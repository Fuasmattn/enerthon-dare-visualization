import React, { useContext, useEffect, useState } from 'react';
import ReactMapGL, { FlyToInterpolator, NavigationControl, Source, Layer, MapEvent } from 'react-map-gl';
import { DataContext } from '../../context/DataProvider';
import { ActionType, Tick } from '../../context/types';
import { UIContext } from '../../context/UIStateProvider';
import { usePrevious } from '../../hooks/usePrevious';
import { masterData, plantTypeMapping } from '../../shared/data';
import { PlantMaster, Powerplant } from '../../shared/types';
import { d3EaseInCubic } from '../../utils/d3Modules';
import { Marker } from '../Marker/Marker';
import { Viewport } from './types';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

const offset = {
  x: 0.05,
  y: -0.025,
};

const parsePower = (power: string): number => {
  const numberAsString = power.replace(' kW', '');
  const parsedPower = parseFloat(numberAsString);

  return parsedPower / 1000;
};

const enrichTick = (tick: Tick): Powerplant[] => {
  let powerplants: Powerplant[] = [];
  tick.PowerPlants &&
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

const getGeoJson = (powerplants: Powerplant[]): FeatureCollection<Geometry, GeoJsonProperties> => {
  return {
    type: 'FeatureCollection',
    features: powerplants.map((powerplant) => {
      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [powerplant.location.longitude, powerplant.location.latitude] },
        properties: null,
      };
    }),
  };
};

const initialViewport: Viewport = {
  latitude: 48,
  longitude: 11,
  zoom: 7,
};

const onClickViewport = (latitude: number, longitude: number): Viewport => {
  return {
    latitude: latitude + offset.y,
    longitude: longitude + offset.x,
    zoom: 12,
    transitionDuration: 800,
    transitionInterpolator: new FlyToInterpolator(),
    transitionEasing: d3EaseInCubic,
  };
};

const navControlStyle = {
  right: 10,
  top: 10,
};

const findDispatchPlant = (powerplants: Powerplant[]): Powerplant | undefined => {
  return powerplants.find((powerplant) => powerplant.state.command !== 0);
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const getDispatchViewport = (
  dispatchPlant: Powerplant | undefined,
  prevDispatchPlant: Powerplant | undefined,
): Viewport | undefined => {
  const dispatchStarted = dispatchPlant && !prevDispatchPlant;
  const dispatchFinished = !dispatchPlant && prevDispatchPlant;

  if (dispatchStarted) {
    return onClickViewport(dispatchPlant.location.latitude, dispatchPlant.location.longitude);
  }
  //  else if (dispatchFinished) {
  //   return {
  //     ...initialViewport,
  //     transitionDuration: 800,
  //     transitionInterpolator: new FlyToInterpolator(),
  //     transitionEasing: d3EaseInCubic,
  //     onTransitionStart: () =>
  //       new Promise((resolve) =>
  //         setTimeout(() => {
  //           resolve(1);
  //         }, 4000),
  //       ), // TODO: find out how this can work https://reactnavigation.org/docs/2.x/transitioner/
  //   };
  // }
};

export const Map: React.FC = () => {
  const [viewport, setViewport] = useState<Viewport>(initialViewport);
  const {
    dispatch,
    state: { privacyMode },
  } = useContext(UIContext);
  const {
    data: { tickData },
  } = useContext(DataContext);

  const powerplants = enrichTick(tickData[tickData.length - 1]);
  const redispatchPlant = findDispatchPlant(powerplants);
  const prevDispatchPlant = usePrevious(redispatchPlant);

  const redispatchViewport = getDispatchViewport(redispatchPlant, prevDispatchPlant);

  useEffect(() => {
    if (redispatchViewport) {
      setViewport(redispatchViewport);
    }
  });

  const __dispatch: (powerplant: Powerplant) => void = redispatchPlant
    ? (powerplant: Powerplant) => {
        !privacyMode && dispatch({ type: ActionType.SELECT_RESOURCE, payload: powerplant });
      }
    : (powerplant: Powerplant) => {
        setViewport(onClickViewport(powerplant.location.latitude, powerplant.location.longitude));
        !privacyMode && dispatch({ type: ActionType.SELECT_RESOURCE, payload: powerplant });
      };

  return (
    <ReactMapGL
      {...viewport}
      width="100%"
      height="100%"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={setViewport}
      onClick={(event) => {
        const feature = event.features?.find((feature) => feature.source === 'powerplants');
        feature ? setViewport(onClickViewport(event.lngLat[1], event.lngLat[0])) : null;
      }}
    >
      {viewport.zoom > 6.5 &&
        powerplants.map((powerplant, i) => {
          return <Marker key={`${powerplant.name}-${i}`} onClick={__dispatch} powerplant={powerplant} />;
        })}
      {viewport.zoom <= 6.5 && (
        <Source id="powerplants" type="geojson" data={getGeoJson(powerplants)}>
          <Layer
            id="point"
            type="circle"
            paint={{ 'circle-radius': 7, 'circle-color': 'red', 'circle-opacity': 0.7 }}
          />
        </Source>
      )}

      <NavigationControl style={navControlStyle} />
    </ReactMapGL>
  );
};
