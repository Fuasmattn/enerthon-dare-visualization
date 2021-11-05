/* eslint-disable @typescript-eslint/no-explicit-any */


export interface Viewport {
  latitude: number;
  longitude: number;
  zoom: number;
  transitionDuration?: number;
  transitionInterpolator?: any;
  transitionEasing?: any;
  onTransitionStart?: any;
}

