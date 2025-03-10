import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Slider,
  Grid,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  BatteryFull as BatteryIcon,
} from "@mui/icons-material";
import { useToast } from "@/components/layout/Layout";
import { Sensor } from "@/types/devices";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Sensor name must be at least 2 characters",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters",
  }),
  sensorType: z.enum([
    "temperature",
    "humidity",
    "pressure",
    "motion",
    "light",
    "air-quality",
    "other",
  ]),
  measurementUnit: z.string().min(1, {
    message: "Measurement unit is required",
  }),
  minValue: z.coerce.number().optional(),
  maxValue: z.coerce.number().optional(),
  alertThreshold: z.coerce.number().optional(),
  batteryLevel: z.coerce.number().min(0).max(100).optional(),
  status: z.enum(["online", "offline", "maintenance"]).default("online"),
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`sensor-tabpanel-${index}`}
      aria-labelledby={`sensor-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function SensorManagement() {
  const { showToast } = useToast();
  const [tabValue, setTabValue] = useState(0);
  const [sensors, setSensors] = useState<Sensor[]>([
    {
      id: "1",
      name: "Office Temperature Sensor",
      location: "Main Office",
      sensorType: "temperature",
      measurementUnit: "°C",
      minValue: -10,
      maxValue: 50,
      alertThreshold: 30,
      batteryLevel: 85,
      type: "sensor",
      status: "online",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Warehouse Humidity Sensor",
      location: "Warehouse Zone B",
      sensorType: "humidity",
      measurementUnit: "%",
      minValue: 0,
      maxValue: 100,
      alertThreshold: 70,
      batteryLevel: 42,
      type: "sensor",
      status: "online",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Entry Motion Detector",
      location: "Front Entrance",
      sensorType: "motion",
      measurementUnit: "movement",
      batteryLevel: 12,
      type: "sensor",
      status: "maintenance",
      lastUpdated: new Date().toISOString(),
    },
  ]);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);

  const {
    control: createControl,
    handleSubmit: handleCreateSubmit,
    reset: resetCreateForm,
    watch: watchCreateForm,
    formState: { errors: createErrors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      sensorType: "temperature",
      measurementUnit: "°C",
      minValue: 0,
      maxValue: 100,
      alertThreshold: 0,
      batteryLevel: 100,
      status: "online",
    },
  });

  const {
    control: editControl,
    handleSubmit: handleEditSubmit,
    reset: resetEditForm,
    watch: watchEditForm,
    formState: { errors: editErrors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      sensorType: "temperature",
      measurementUnit: "",
      minValue: 0,
      maxValue: 0,
      alertThreshold: 0,
      batteryLevel: 0,
      status: "online",
    },
  });

  // Watch for form value changes to set default measurement units
  const createSensorType = watchCreateForm("sensorType");
  const editSensorType = watchEditForm("sensorType");

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  function onCreateSubmit(values: z.infer<typeof formSchema>) {
    const newSensor: Sensor = {
      ...values,
      id: Date.now().toString(),
      type: "sensor",
      lastUpdated: new Date().toISOString(),
    };

    setSensors([...sensors, newSensor]);

    showToast(`${values.name} has been added to the system.`, "success");

    resetCreateForm();
    setTabValue(0); // Switch to list tab after adding
  }

  function openEditDialog(sensor: Sensor) {
    setSelectedSensor(sensor);
    resetEditForm({
      name: sensor.name,
      location: sensor.location,
      sensorType: sensor.sensorType,
      measurementUnit: sensor.measurementUnit,
      minValue: sensor.minValue,
      maxValue: sensor.maxValue,
      alertThreshold: sensor.alertThreshold,
      batteryLevel: sensor.batteryLevel,
      status: sensor.status,
    });
    setEditDialogOpen(true);
  }

  function onEditSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedSensor) return;

    const updatedSensors = sensors.map((sensor) =>
      sensor.id === selectedSensor.id
        ? {
            ...sensor,
            ...values,
            lastUpdated: new Date().toISOString(),
          }
        : sensor,
    );

    setSensors(updatedSensors);

    showToast(`${values.name}'s information has been updated.`, "success");

    setEditDialogOpen(false);
    setSelectedSensor(null);
  }

  function openDeleteDialog(sensor: Sensor) {
    setSelectedSensor(sensor);
    setDeleteDialogOpen(true);
  }

  function deleteSensor() {
    if (!selectedSensor) return;

    setSensors(sensors.filter((sensor) => sensor.id !== selectedSensor.id));

    showToast("The sensor has been removed from the system.", "success");

    setDeleteDialogOpen(false);
    setSelectedSensor(null);
  }

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case "online":
        return "success";
      case "offline":
        return "error";
      case "maintenance":
        return "warning";
      default:
        return "default";
    }
  };

  const getBatteryColor = (level: number | undefined) => {
    if (!level) return "default";
    if (level > 70) return "success";
    if (level > 30) return "warning";
    return "error";
  };

  const getSensorTypeLabel = (type: string) => {
    switch (type) {
      case "temperature":
        return "Temperature";
      case "humidity":
        return "Humidity";
      case "pressure":
        return "Pressure";
      case "motion":
        return "Motion";
      case "light":
        return "Light";
      case "air-quality":
        return "Air Quality";
      case "other":
        return "Other";
      default:
        return type;
    }
  };

  const getDefaultUnit = (type: string) => {
    switch (type) {
      case "temperature":
        return "°C";
      case "humidity":
        return "%";
      case "pressure":
        return "hPa";
      case "motion":
        return "movement";
      case "light":
        return "lux";
      case "air-quality":
        return "ppm";
      default:
        return "";
    }
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto" }}>
      <Typography variant="h3" component="h1" sx={{ mb: 4 }}>
        Sensor Management
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="sensor management tabs"
          sx={{ mb: 2 }}
        >
          <Tab label="Sensor List" />
          <Tab label="Register Sensor" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Card>
          <CardHeader
            title="Registered Sensors"
            subheader="View and manage all sensors in the system."
          />
          <CardContent>
            {sensors.length === 0 ? (
              <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                No sensors registered yet. Add a sensor to get started.
              </Typography>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Unit</TableCell>
                      <TableCell>Range</TableCell>
                      <TableCell>Alert Threshold</TableCell>
                      <TableCell>Battery</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right" width={120}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sensors.map((sensor) => (
                      <TableRow key={sensor.id}>
                        <TableCell component="th" scope="row">
                          {sensor.name}
                        </TableCell>
                        <TableCell>{sensor.location}</TableCell>
                        <TableCell>
                          {getSensorTypeLabel(sensor.sensorType)}
                        </TableCell>
                        <TableCell>{sensor.measurementUnit}</TableCell>
                        <TableCell>
                          {sensor.minValue !== undefined &&
                          sensor.maxValue !== undefined
                            ? `${sensor.minValue} - ${sensor.maxValue}`
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {sensor.alertThreshold !== undefined
                            ? `${sensor.alertThreshold} ${sensor.measurementUnit}`
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {sensor.batteryLevel !== undefined ? (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <BatteryIcon
                                fontSize="small"
                                color={
                                  getBatteryColor(sensor.batteryLevel) as
                                    | "success"
                                    | "error"
                                    | "warning"
                                    | "default"
                                }
                                sx={{ mr: 0.5 }}
                              />
                              {sensor.batteryLevel}%
                            </Box>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={sensor.status}
                            color={
                              getStatusChipColor(sensor.status) as
                                | "success"
                                | "error"
                                | "warning"
                                | "default"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Box
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                          >
                            <IconButton
                              aria-label="edit"
                              color="primary"
                              onClick={() => openEditDialog(sensor)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              aria-label="delete"
                              color="error"
                              onClick={() => openDeleteDialog(sensor)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Card>
          <CardHeader
            title="Register New Sensor"
            subheader="Add a new sensor to the system."
          />
          <CardContent>
            <form onSubmit={handleCreateSubmit(onCreateSubmit)}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Controller
                  name="name"
                  control={createControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Sensor Name"
                      placeholder="Office Temperature Sensor"
                      error={!!createErrors.name}
                      helperText={
                        createErrors.name
                          ? createErrors.name.message
                          : "A descriptive name for the sensor."
                      }
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name="location"
                  control={createControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Location"
                      placeholder="Main Office"
                      error={!!createErrors.location}
                      helperText={
                        createErrors.location
                          ? createErrors.location.message
                          : "Where the sensor is installed."
                      }
                      fullWidth
                    />
                  )}
                />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="sensorType"
                      control={createControl}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id="sensor-type-label">
                            Sensor Type
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="sensor-type-label"
                            label="Sensor Type"
                          >
                            <MenuItem value="temperature">Temperature</MenuItem>
                            <MenuItem value="humidity">Humidity</MenuItem>
                            <MenuItem value="pressure">Pressure</MenuItem>
                            <MenuItem value="motion">Motion</MenuItem>
                            <MenuItem value="light">Light</MenuItem>
                            <MenuItem value="air-quality">Air Quality</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                          </Select>
                          <FormHelperText>
                            Type of measurement this sensor performs.
                          </FormHelperText>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="measurementUnit"
                      control={createControl}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Measurement Unit"
                          placeholder={getDefaultUnit(createSensorType)}
                          error={!!createErrors.measurementUnit}
                          helperText={
                            createErrors.measurementUnit
                              ? createErrors.measurementUnit.message
                              : "Unit of measurement (e.g., °C, %, lux)."
                          }
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="minValue"
                      control={createControl}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          label="Minimum Value"
                          helperText="Minimum value this sensor can measure."
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="maxValue"
                      control={createControl}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          label="Maximum Value"
                          helperText="Maximum value this sensor can measure."
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="alertThreshold"
                      control={createControl}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          label="Alert Threshold"
                          helperText="Value that triggers an alert when exceeded."
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="batteryLevel"
                      control={createControl}
                      render={({ field }) => (
                        <Box sx={{ width: "100%" }}>
                          <Typography id="battery-slider" gutterBottom>
                            Battery Level: {field.value}%
                          </Typography>
                          <Slider
                            value={field.value || 100}
                            onChange={(_, newValue) => field.onChange(newValue)}
                            aria-labelledby="battery-slider"
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={0}
                            max={100}
                          />
                          <FormHelperText>
                            Current battery level of the sensor.
                          </FormHelperText>
                        </Box>
                      )}
                    />
                  </Grid>
                </Grid>

                <Controller
                  name="status"
                  control={createControl}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="status-label">Status</InputLabel>
                      <Select {...field} labelId="status-label" label="Status">
                        <MenuItem value="online">Online</MenuItem>
                        <MenuItem value="offline">Offline</MenuItem>
                        <MenuItem value="maintenance">Maintenance</MenuItem>
                      </Select>
                      <FormHelperText>
                        Current operational status of the sensor.
                      </FormHelperText>
                    </FormControl>
                  )}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2, alignSelf: "flex-start" }}
                >
                  Register Sensor
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Sensor</DialogTitle>
        <form onSubmit={handleEditSubmit(onEditSubmit)}>
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                pt: 1,
                minWidth: 400,
              }}
            >
              <Controller
                name="name"
                control={editControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Name"
                    error={!!editErrors.name}
                    helperText={editErrors.name?.message}
                    fullWidth
                  />
                )}
              />

              <Controller
                name="location"
                control={editControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Location"
                    error={!!editErrors.location}
                    helperText={editErrors.location?.message}
                    fullWidth
                  />
                )}
              />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="sensorType"
                    control={editControl}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel id="edit-sensor-type-label">
                          Sensor Type
                        </InputLabel>
                        <Select
                          {...field}
                          labelId="edit-sensor-type-label"
                          label="Sensor Type"
                        >
                          <MenuItem value="temperature">Temperature</MenuItem>
                          <MenuItem value="humidity">Humidity</MenuItem>
                          <MenuItem value="pressure">Pressure</MenuItem>
                          <MenuItem value="motion">Motion</MenuItem>
                          <MenuItem value="light">Light</MenuItem>
                          <MenuItem value="air-quality">Air Quality</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="measurementUnit"
                    control={editControl}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Measurement Unit"
                        error={!!editErrors.measurementUnit}
                        helperText={editErrors.measurementUnit?.message}
                        fullWidth
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="minValue"
                    control={editControl}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Minimum Value"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="maxValue"
                    control={editControl}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Maximum Value"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="alertThreshold"
                    control={editControl}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Alert Threshold"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="batteryLevel"
                    control={editControl}
                    render={({ field }) => (
                      <Box sx={{ width: "100%" }}>
                        <Typography id="edit-battery-slider" gutterBottom>
                          Battery Level: {field.value}%
                        </Typography>
                        <Slider
                          value={field.value || 0}
                          onChange={(_, newValue) => field.onChange(newValue)}
                          aria-labelledby="edit-battery-slider"
                          valueLabelDisplay="auto"
                          step={1}
                          marks
                          min={0}
                          max={100}
                        />
                      </Box>
                    )}
                  />
                </Grid>
              </Grid>

              <Controller
                name="status"
                control={editControl}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id="edit-status-label">Status</InputLabel>
                    <Select
                      {...field}
                      labelId="edit-status-label"
                      label="Status"
                    >
                      <MenuItem value="online">Online</MenuItem>
                      <MenuItem value="offline">Offline</MenuItem>
                      <MenuItem value="maintenance">Maintenance</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button type="submit" color="primary">
              Save Changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Sensor</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedSensor?.name}? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={deleteSensor} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
