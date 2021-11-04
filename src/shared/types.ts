/* eslint-disable no-unused-vars */
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
  command?: number;
}

export interface MasterData {
  [key: string]: PlantMaster;
}

export interface PlantTypeMapping {
  [key: string]: PowerplantType
}

export interface PlantMaster {
  Klarname: string;
  Anschlussnetzbetreiber: string;
  AnschlussnetzbetreiberMPID: number;
  SRID: string;
  Energietraeger: string;
  Regelzone: string;
  EnthalteneTR: string;
  MasterNrTR: string;
  KlarnameTR: string;
  TRID: string;
  Nettonennleistung: string;
  GeokoordinatenTRs: string;
  Latitude: number;
  Longitude: number;
}
