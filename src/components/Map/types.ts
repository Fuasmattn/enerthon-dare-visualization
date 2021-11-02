import { Resource } from '../../shared/types';

export interface Viewport {
  latitude: number;
  longitude: number;
  zoom: number;
}

export interface MarkerProps {
  resource: Resource;
  longitude: number;
  latitude: number;
  onClick: (resource: Resource) => void;
}
