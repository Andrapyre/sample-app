import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IoTDevice, Camera, Microscope, Sensor } from "@/types/devices";

interface DeviceState {
  devices: IoTDevice[];
  loading: boolean;
  stats: {
    total: number;
    online: number;
    offline: number;
    maintenance: number;
    cameras: number;
    microscopes: number;
    sensors: number;
  };
  dataTransmission: {
    time: string;
    cameras: string | number;
    microscopes: string | number;
    sensors: string | number;
  }[];
}

const initialState: DeviceState = {
  devices: [
    {
      id: "1",
      name: "Front Door Camera",
      location: "Main Entrance",
      ipAddress: "192.168.1.100",
      type: "camera",
      status: "online",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Lab Microscope A",
      location: "Research Lab 1",
      model: "Olympus BX53",
      magnification: 1000,
      digitalOutput: true,
      type: "microscope",
      status: "online",
      lastUpdated: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    {
      id: "3",
      name: "Office Temperature Sensor",
      location: "Main Office",
      sensorType: "temperature",
      measurementUnit: "°C",
      type: "sensor",
      status: "online",
      lastUpdated: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    },
    {
      id: "4",
      name: "Warehouse Camera",
      location: "Storage Area",
      ipAddress: "192.168.1.102",
      type: "camera",
      status: "offline",
      lastUpdated: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
    {
      id: "5",
      name: "Quality Control Microscope",
      location: "Manufacturing Floor",
      model: "Zeiss Axio",
      magnification: 200,
      digitalOutput: false,
      type: "microscope",
      status: "maintenance",
      lastUpdated: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    },
  ],
  loading: false,
  stats: {
    total: 5,
    online: 3,
    offline: 1,
    maintenance: 1,
    cameras: 2,
    microscopes: 2,
    sensors: 1,
  },
  dataTransmission: [
    { time: "00:00", cameras: "0", microscopes: "0", sensors: "0" },
    { time: "04:00", cameras: "0", microscopes: "0", sensors: "0" },
    { time: "08:00", cameras: "0", microscopes: "0", sensors: "0" },
    { time: "12:00", cameras: "0", microscopes: "0", sensors: "0" },
    { time: "16:00", cameras: "0", microscopes: "0", sensors: "0" },
    { time: "20:00", cameras: "0", microscopes: "0", sensors: "0" },
    { time: "Now", cameras: "0", microscopes: "0", sensors: "0" },
  ],
};

const deviceSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    fetchDevices: (state) => {
      // Calculate stats
      state.stats = {
        total: state.devices.length,
        online: state.devices.filter((d) => d.status === "online").length,
        offline: state.devices.filter((d) => d.status === "offline").length,
        maintenance: state.devices.filter((d) => d.status === "maintenance")
          .length,
        cameras: state.devices.filter((d) => d.type === "camera").length,
        microscopes: state.devices.filter((d) => d.type === "microscope")
          .length,
        sensors: state.devices.filter((d) => d.type === "sensor").length,
      };

      // Generate random data transmission values over time (in GB/s)
      state.dataTransmission = [
        {
          time: "00:00",
          cameras: (Math.random() * 3 + 1).toFixed(2),
          microscopes: (Math.random() * 5 + 2).toFixed(2),
          sensors: (Math.random() * 1 + 0.2).toFixed(2),
        },
        {
          time: "04:00",
          cameras: (Math.random() * 3 + 1).toFixed(2),
          microscopes: (Math.random() * 5 + 2).toFixed(2),
          sensors: (Math.random() * 1 + 0.2).toFixed(2),
        },
        {
          time: "08:00",
          cameras: (Math.random() * 4 + 2).toFixed(2),
          microscopes: (Math.random() * 6 + 3).toFixed(2),
          sensors: (Math.random() * 1.5 + 0.3).toFixed(2),
        },
        {
          time: "12:00",
          cameras: (Math.random() * 5 + 3).toFixed(2),
          microscopes: (Math.random() * 7 + 4).toFixed(2),
          sensors: (Math.random() * 2 + 0.4).toFixed(2),
        },
        {
          time: "16:00",
          cameras: (Math.random() * 5 + 3).toFixed(2),
          microscopes: (Math.random() * 7 + 4).toFixed(2),
          sensors: (Math.random() * 2 + 0.4).toFixed(2),
        },
        {
          time: "20:00",
          cameras: (Math.random() * 4 + 2).toFixed(2),
          microscopes: (Math.random() * 6 + 3).toFixed(2),
          sensors: (Math.random() * 1.5 + 0.3).toFixed(2),
        },
        {
          time: "Now",
          cameras: (Math.random() * 5 + 2).toFixed(2),
          microscopes: (Math.random() * 8 + 4).toFixed(2),
          sensors: (Math.random() * 2 + 0.5).toFixed(2),
        },
      ];
    },
    addDevice: (state, action: PayloadAction<IoTDevice>) => {
      state.devices.push(action.payload);
      // Recalculate stats
      state.stats = {
        total: state.devices.length,
        online: state.devices.filter((d) => d.status === "online").length,
        offline: state.devices.filter((d) => d.status === "offline").length,
        maintenance: state.devices.filter((d) => d.status === "maintenance")
          .length,
        cameras: state.devices.filter((d) => d.type === "camera").length,
        microscopes: state.devices.filter((d) => d.type === "microscope")
          .length,
        sensors: state.devices.filter((d) => d.type === "sensor").length,
      };
    },
    updateDevice: (state, action: PayloadAction<IoTDevice>) => {
      const index = state.devices.findIndex(
        (device) => device.id === action.payload.id,
      );
      if (index !== -1) {
        state.devices[index] = action.payload;
      }
      // Recalculate stats
      state.stats = {
        total: state.devices.length,
        online: state.devices.filter((d) => d.status === "online").length,
        offline: state.devices.filter((d) => d.status === "offline").length,
        maintenance: state.devices.filter((d) => d.status === "maintenance")
          .length,
        cameras: state.devices.filter((d) => d.type === "camera").length,
        microscopes: state.devices.filter((d) => d.type === "microscope")
          .length,
        sensors: state.devices.filter((d) => d.type === "sensor").length,
      };
    },
    deleteDevice: (state, action: PayloadAction<string>) => {
      state.devices = state.devices.filter(
        (device) => device.id !== action.payload,
      );
      // Recalculate stats
      state.stats = {
        total: state.devices.length,
        online: state.devices.filter((d) => d.status === "online").length,
        offline: state.devices.filter((d) => d.status === "offline").length,
        maintenance: state.devices.filter((d) => d.status === "maintenance")
          .length,
        cameras: state.devices.filter((d) => d.type === "camera").length,
        microscopes: state.devices.filter((d) => d.type === "microscope")
          .length,
        sensors: state.devices.filter((d) => d.type === "sensor").length,
      };
    },
  },
});

export const {
  setLoading,
  fetchDevices,
  addDevice,
  updateDevice,
  deleteDevice,
} = deviceSlice.actions;

export default deviceSlice.reducer;
