import * as React from 'react';
import MapGL, {MapContext} from 'react-map-gl';

interface MarkerProps {
    longitude: number;
    latitude: number;
}

export function Marker(props: MarkerProps) {
    const context = React.useContext(MapContext);
    
    const {longitude, latitude} = props;

    const [x, y] = context.viewport ? context.viewport.project([longitude, latitude]) : [0, 0];
  
    const markerStyle: React.CSSProperties = {
        position: 'absolute',
        background: '#fff',
        left: x,
        top: y
    };
  
    return (
        <div style={markerStyle} >
            ({longitude}, {latitude})
        </div>
    );
}