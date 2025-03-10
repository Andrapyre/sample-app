// Base device interface
export interface Device {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline" | "maintenance";
  lastUpdated: string; // ISO date string
}

// Camera specific properties
export interface Camera extends Device {
  type: "camera";
  ipAddress: string;
  resolution?: string;
  storageRetention?: number; // in days
}

// Microscope specific properties
export interface Microscope extends Device {
  type: "microscope";
  model: string;
  magnification: number;
  digitalOutput: boolean;
  calibrationDate?: string; // ISO date string
}

// Sensor specific properties
export interface Sensor extends Device {
  type: "sensor";
  sensorType:
    | "temperature"
    | "humidity"
    | "pressure"
    | "motion"
    | "light"
    | "air-quality"
    | "other";
  measurementUnit: string;
  minValue?: number;
  maxValue?: number;
  alertThreshold?: number;
  batteryLevel?: number; // percentage
}

// Union type for all device types
export type IoTDevice = Camera | Microscope | Sensor;
