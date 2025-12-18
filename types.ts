
export enum FlightStatus {
  NORMAL = 'NORMAL',
  DELAYED = 'DELAYED',
  EMERGENCY = 'EMERGENCY',
  LANDING = 'LANDING',
  CONFLICT = 'CONFLICT'
}

export interface StandInfo {
  id: string;
  status: 'Occupied' | 'Available' | 'Maintenance';
  assignedDrone?: string;
}

export interface Vertiport {
  id: string;
  code: string;
  name: string;
  lat: number;
  lng: number;
  stands: number;
  occupiedStands: number;
  status: 'Active' | 'Busy' | 'Standby' | 'Maintenance';
  frequency: string;
  elevation: number;
  lights: 'Green' | 'Amber' | 'Red';
  weather: {
    temp: number;
    wind: string;
    visibility: string;
    pressure: string;
  };
  standDetails: StandInfo[];
}

export interface ControlCenter {
  id: string;
  name: string;
  type: 'ACC' | 'APP' | 'TWR';
  lat: number;
  lng: number;
  frequency: string;
  sector: string;
}

export interface DroneFlight {
  id: string;
  callSign: string;
  squawk: string;
  origin: string;
  destination: string;
  currentPos: [number, number];
  altitude: number;
  speed: number;
  battery: number;
  status: FlightStatus;
  path: [number, number][];
  history: [number, number][];
  progress: number;
}

export interface VisibilityState {
  vp: boolean;
  route: boolean;
  fix: boolean;
  nfz: boolean;
  weather: boolean;
  trails: boolean;
  sectors: boolean;
  wind: boolean;
}

export interface LogEntry {
  id: string;
  time: string;
  type: 'INFO' | 'WARN' | 'ERR';
  message: string;
  source: string;
}
