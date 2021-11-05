import React, { useContext, useEffect, useState } from 'react';
import ReactMapGL, { FlyToInterpolator, NavigationControl, Source, Layer} from 'react-map-gl';
import { DataContext } from '../../context/DataProvider';
import { ActionType, Tick } from '../../context/types';
import { UIContext } from '../../context/UIStateProvider';
import { usePrevious } from '../../hooks/usePrevious';
import { masterData, plantTypeMapping } from '../../shared/data';
import { PlantMaster, Powerplant } from '../../shared/types';
import { d3EaseInCubic } from '../../utils/d3Modules';
import { Marker } from '../Marker/Marker';
import { Viewport } from './types';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson'


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
        return {type: 'Feature', geometry: {type: 'Point', coordinates: [powerplant.location.longitude, powerplant.location.latitude]}, properties: null}
      })
  }
}

const initialViewport: Viewport = {
  latitude: 48,
  longitude: 11,
  zoom: 6.5,
};

const navControlStyle = {
  right: 10,
  top: 10,
};

const findDispatchPlant = (powerplants: Powerplant[]): Powerplant | undefined => {
  return powerplants.find(powerplant => powerplant.state.command !== 0)
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const getDispatchViewport = (dispatchPlant: Powerplant | undefined, prevDispatchPlant: Powerplant | undefined): Viewport | undefined => {
  const dispatchStarted = dispatchPlant && !prevDispatchPlant;
  const dispatchFinished = !dispatchPlant && prevDispatchPlant

  if (dispatchStarted) {
    console.log("Dispatch started");
    return {
      latitude: dispatchPlant.location.latitude - 0.4, // -offset
      longitude: dispatchPlant.location.longitude + 0.2, // +offset
      zoom: 7.5,
      transitionDuration: 800,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: d3EaseInCubic,
    } 
  } else if (dispatchFinished) {
    return { 
      ...initialViewport,
      transitionDuration: 800,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: d3EaseInCubic,
      onTransitionStart: () => new Promise(resolve => setTimeout(resolve, 4000)) // TODO: find out how this can work https://reactnavigation.org/docs/2.x/transitioner/
    };
  }
}

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
  const dispatchPlant = findDispatchPlant(powerplants);
  const prevDispatchPlant = usePrevious(dispatchPlant);
  
  const dispatchViewport = getDispatchViewport(dispatchPlant, prevDispatchPlant);
  
  useEffect(
    () => {
      if (dispatchViewport) {
        setViewport(dispatchViewport);
      } 
    }
  )
  
  
  console.log("dispatchPlant && !prevDispatchPlant: " + (dispatchPlant && !prevDispatchPlant) + " (" + dispatchPlant + ", " + prevDispatchPlant + ")")
  console.log("!dispatchPlant && prevDispatchPlant: " + (!dispatchPlant && prevDispatchPlant) + " (" + dispatchPlant + ", " + prevDispatchPlant + ")")

  const __dispatch: (powerplant: Powerplant) => void = dispatchPlant ?
    (powerplant: Powerplant) =>  {
        setViewport({
          latitude: powerplant.location.latitude - 0.4, // -offset
          longitude: powerplant.location.longitude + 0.2, // +offset
          zoom: 7.5,
          transitionDuration: 800,
          transitionInterpolator: new FlyToInterpolator(),
          transitionEasing: d3EaseInCubic,
        });
        !privacyMode && dispatch({ type: ActionType.SELECT_RESOURCE, payload: powerplant });
    } : 
    (powerplant: Powerplant) => {
      !privacyMode && dispatch({ type: ActionType.SELECT_RESOURCE, payload: powerplant });
    }

  console.log(viewport.zoom);

  return (
    <ReactMapGL
      {...viewport}
      width="100%"
      height="100%"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={setViewport}
    >
      {powerplants.map((powerplant, i) => {
        return <Marker key={`${powerplant.name}-${i}`} onClick={__dispatch} powerplant={powerplant} />;
      })}
      {(viewport.zoom < 4) && (
        <Source id="my-data" type="geojson" data={getGeoJson(powerplants)}>
          <Layer id='point' type='circle' paint={{'circle-radius': 10, 'circle-color': 'red'}} />
        </Source>
      )}
        
    
      <NavigationControl style={navControlStyle} />
    </ReactMapGL>
  );
};
