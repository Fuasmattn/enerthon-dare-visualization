import { Resource } from '../shared/types';

export interface UIState {
  selectedResource: Resource | null;
  showTimeline: boolean;
}

export enum ActionType {
  SELECT_RESOURCE,
  DESELECT_RESOURCE,
  TOGGLE_TIMELINE,
}

export interface DeselectResourceAction {
  type: ActionType.DESELECT_RESOURCE;
}

export interface SelectResourceAction {
  type: ActionType.SELECT_RESOURCE;
  payload: Resource;
}

export interface ToggleTimelineAction {
  type: ActionType.TOGGLE_TIMELINE;
}

export type Action = DeselectResourceAction | SelectResourceAction | ToggleTimelineAction;
