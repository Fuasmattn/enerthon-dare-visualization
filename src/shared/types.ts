export interface Powerplant {
  type: PowerplantType;
  id: string;
  name: string;
  location: Location;
  max_power: number;
  min_power: number;
  state: PowerplantState;
}

export enum PowerplantType {
  BIOGAS = 'Biogas',
  SOLAR = 'Solar',
  WIND = 'Wind',
}

export interface Location {
  longitude: number;
  latitude: number;
}

export interface PowerplantState {
  ist: number;
  potential_plus: number;
  potential_minus: number;
}
