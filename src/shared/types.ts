export interface Resource {
  type: ResourceType;
  id: string;
}

export enum ResourceType {
  BIOGAS = 'Biogas',
  SOLAR = 'Solar',
  WATER = 'Water',
}
