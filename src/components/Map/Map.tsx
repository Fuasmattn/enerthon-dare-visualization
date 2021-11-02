import * as React from 'react';
import ReactMapGL, {Source, Layer} from 'react-map-gl';
import {Marker} from './Marker';

interface Viewport {
    latitude: number;
    longitude: number;
    zoom: number;
}

const geojson: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
    type: 'FeatureCollection',
    features: [
        {type: 'Feature', geometry: {type: 'Point', coordinates: [-122.4, 37.8]}, properties: null}
    ]
};

const paint = {
    'circle-radius': 10,
    'circle-color': '#007cbf'
};


function Map() {
  const [viewport, setViewport] = React.useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8
  });

  return (
    <ReactMapGL
      {...viewport}
      width="100%"
      height="90vh"
      mapboxApiAccessToken="pk.eyJ1Ijoic2ltb25zdGVpbmhlYmVyIiwiYSI6ImNqcjd4N2RvdDAwczY0NHM3cDFndG1zamcifQ.U15J9NVbO3Xs22W4bTYmnw"
      onViewportChange={(viewport: Viewport) => setViewport(viewport)}
    >
        <Marker latitude={37.7577} longitude={-122.4376}/>
        {/* <Source id="my-data" type="geojson" data={geojson}>
            <Layer id='point' type="circle" paint={paint}/>
        </Source> */}
    </ReactMapGL>
  );
}

export default Map;








function App() {
  const [viewport, setViewport] = React.useState({
    longitude: -122.45,
    latitude: 37.78,
    zoom: 14
  });
  return (
    <ReactMapGL {...viewport} width="100vw" height="100vh" onViewportChange={setViewport}>

    </ReactMapGL>
  );
}