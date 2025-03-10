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
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { useToast } from "@/components/layout/Layout";
import { Camera } from "@/types/devices";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Camera name must be at least 2 characters",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters",
  }),
  ipAddress: z.string().ip({
    message: "Please enter a valid IP address",
  }),
  resolution: z.string().optional(),
  storageRetention: z.coerce.number().min(1).optional(),
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
      id={`camera-tabpanel-${index}`}
      aria-labelledby={`camera-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function CameraManagement() {
  const { showToast } = useToast();
  const [tabValue, setTabValue] = useState(0);
  const [cameras, setCameras] = useState<Camera[]>([
    {
      id: "1",
      name: "Front Door Camera",
      location: "Main Entrance",
      ipAddress: "192.168.1.100",
      type: "camera",
      status: "online",
      resolution: "1080p",
      storageRetention: 30,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Parking Lot Camera",
      location: "North Parking",
      ipAddress: "192.168.1.101",
      type: "camera",
      status: "online",
      resolution: "4K",
      storageRetention: 14,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Warehouse Camera",
      location: "Storage Area",
      ipAddress: "192.168.1.102",
      type: "camera",
      status: "offline",
      resolution: "720p",
      storageRetention: 7,
      lastUpdated: new Date().toISOString(),
    },
  ]);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);

  const {
    control: createControl,
    handleSubmit: handleCreateSubmit,
    reset: resetCreateForm,
    formState: { errors: createErrors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      ipAddress: "",
      resolution: "1080p",
      storageRetention: 30,
      status: "online",
    },
  });

  const {
    control: editControl,
    handleSubmit: handleEditSubmit,
    reset: resetEditForm,
    formState: { errors: editErrors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      ipAddress: "",
      resolution: "",
      storageRetention: 0,
      status: "online",
    },
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  function onCreateSubmit(values: z.infer<typeof formSchema>) {
    const newCamera: Camera = {
      ...values,
      id: Date.now().toString(),
      type: "camera",
      lastUpdated: new Date().toISOString(),
    };

    setCameras([...cameras, newCamera]);

    showToast(`${values.name} has been added to the system.`, "success");

    resetCreateForm();
    setTabValue(0); // Switch to list tab after adding
  }

  function openEditDialog(camera: Camera) {
    setSelectedCamera(camera);
    resetEditForm({
      name: camera.name,
      location: camera.location,
      ipAddress: camera.ipAddress,
      resolution: camera.resolution || "",
      storageRetention: camera.storageRetention || 0,
      status: camera.status,
    });
    setEditDialogOpen(true);
  }

  function onEditSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedCamera) return;

    const updatedCameras = cameras.map((camera) =>
      camera.id === selectedCamera.id
        ? {
            ...camera,
            ...values,
            lastUpdated: new Date().toISOString(),
          }
        : camera,
    );

    setCameras(updatedCameras);

    showToast(`${values.name}'s information has been updated.`, "success");

    setEditDialogOpen(false);
    setSelectedCamera(null);
  }

  function openDeleteDialog(camera: Camera) {
    setSelectedCamera(camera);
    setDeleteDialogOpen(true);
  }

  function deleteCamera() {
    if (!selectedCamera) return;

    setCameras(cameras.filter((camera) => camera.id !== selectedCamera.id));

    showToast("The camera has been removed from the system.", "success");

    setDeleteDialogOpen(false);
    setSelectedCamera(null);
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

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto" }}>
      <Typography variant="h3" component="h1" sx={{ mb: 4 }}>
        Camera Management
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="camera management tabs"
          sx={{ mb: 2 }}
        >
          <Tab label="Camera List" />
          <Tab label="Register Camera" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Card>
          <CardHeader
            title="Registered Cameras"
            subheader="View and manage all cameras in the system."
          />
          <CardContent>
            {cameras.length === 0 ? (
              <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                No cameras registered yet. Add a camera to get started.
              </Typography>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>IP Address</TableCell>
                      <TableCell>Resolution</TableCell>
                      <TableCell>Storage (days)</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right" width={120}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cameras.map((camera) => (
                      <TableRow key={camera.id}>
                        <TableCell component="th" scope="row">
                          {camera.name}
                        </TableCell>
                        <TableCell>{camera.location}</TableCell>
                        <TableCell>{camera.ipAddress}</TableCell>
                        <TableCell>{camera.resolution || "N/A"}</TableCell>
                        <TableCell>
                          {camera.storageRetention || "N/A"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={camera.status}
                            color={
                              getStatusChipColor(camera.status) as
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
                              onClick={() => openEditDialog(camera)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              aria-label="delete"
                              color="error"
                              onClick={() => openDeleteDialog(camera)}
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
            title="Register New Camera"
            subheader="Add a new camera to the monitoring system."
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
                      label="Camera Name"
                      placeholder="Front Door Camera"
                      error={!!createErrors.name}
                      helperText={
                        createErrors.name
                          ? createErrors.name.message
                          : "A descriptive name for the camera."
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
                      placeholder="Main Entrance"
                      error={!!createErrors.location}
                      helperText={
                        createErrors.location
                          ? createErrors.location.message
                          : "Where the camera is installed."
                      }
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name="ipAddress"
                  control={createControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="IP Address"
                      placeholder="192.168.1.100"
                      error={!!createErrors.ipAddress}
                      helperText={
                        createErrors.ipAddress
                          ? createErrors.ipAddress.message
                          : "The IP address of the camera on the network."
                      }
                      fullWidth
                    />
                  )}
                />

                <Box sx={{ display: "flex", gap: 3 }}>
                  <Controller
                    name="resolution"
                    control={createControl}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Resolution"
                        placeholder="1080p"
                        helperText="The video resolution of the camera."
                        fullWidth
                      />
                    )}
                  />

                  <Controller
                    name="storageRetention"
                    control={createControl}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Storage Retention (days)"
                        placeholder="30"
                        helperText="How long to keep recordings."
                        fullWidth
                      />
                    )}
                  />
                </Box>

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
                        Current operational status of the camera.
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
                  Register Camera
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Camera</DialogTitle>
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

              <Controller
                name="ipAddress"
                control={editControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="IP Address"
                    error={!!editErrors.ipAddress}
                    helperText={editErrors.ipAddress?.message}
                    fullWidth
                  />
                )}
              />

              <Box sx={{ display: "flex", gap: 3 }}>
                <Controller
                  name="resolution"
                  control={editControl}
                  render={({ field }) => (
                    <TextField {...field} label="Resolution" fullWidth />
                  )}
                />

                <Controller
                  name="storageRetention"
                  control={editControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Storage Retention (days)"
                      fullWidth
                    />
                  )}
                />
              </Box>

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
        <DialogTitle>Delete Camera</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedCamera?.name}? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={deleteCamera} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
