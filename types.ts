
export interface CarDetails {
  make: string;
  model: string;
  licensePlate: string;
  mobileNumber: string;
}

export interface DriverDetails {
  name: string;
  mobileNumber: string;
  avatarUrl: string;
}

export enum AppState {
  REGISTRATION = 'REGISTRATION',
  TRACKING = 'TRACKING',
}

export enum ViewMode {
  CUSTOMER = 'CUSTOMER',
  VALET = 'VALET',
}

export enum RetrievalStatus {
  NONE = 'NONE',
  REQUESTED = 'REQUESTED',
  IN_TRANSIT = 'IN_TRANSIT',
  READY = 'READY',
}
