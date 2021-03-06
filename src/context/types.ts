/* eslint-disable no-unused-vars */
import { Powerplant } from '../shared/types';

export interface UIState {
  selectedResource: Powerplant | null;
  showTimeline: boolean;
  privacyMode: boolean;
}

export enum ActionType {
  SELECT_RESOURCE,
  DESELECT_RESOURCE,
  TOGGLE_TIMELINE,
  TOGGLE_PRIVACY,
}

export interface DeselectResourceAction {
  type: ActionType.DESELECT_RESOURCE;
}

export interface SelectResourceAction {
  type: ActionType.SELECT_RESOURCE;
  payload: Powerplant;
}

export interface ToggleTimelineAction {
  type: ActionType.TOGGLE_TIMELINE;
}

export interface TogglePrivacyModeAction {
  type: ActionType.TOGGLE_PRIVACY;
}

export type Action = DeselectResourceAction | SelectResourceAction | ToggleTimelineAction | TogglePrivacyModeAction;

export type Tick = {
  NetStates: {
    ist: number;
    name: string;
    pot_minus: number;
    pot_plus: number;
  }[];
  PowerPlants: {
    command: number;
    ist: number;
    name: string;
    pot_minus: number;
    pot_plus: number;
  }[];
  time: number;
};
