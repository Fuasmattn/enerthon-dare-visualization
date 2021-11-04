import { Powerplant, PowerplantState } from '../../shared/types';

export interface MarkerProps {
    powerplant: Powerplant;
    onClick: (resource: Powerplant) => void;
}

export interface PowerStateProps {
    max_power: number;
    min_power: number;
    state: PowerplantState;
}
  