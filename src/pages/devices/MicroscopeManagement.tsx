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
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { useToast } from "@/components/layout/Layout";
import { Microscope } from "@/types/devices";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Microscope name must be at least 2 characters",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters",
  }),
  model: z.string().min(2, {
    message: "Model must be at least 2 characters",
  }),
  magnification: z.coerce.number().min(1, {
    message: "Magnification must be at least 1",
  }),
  digitalOutput: z.boolean().default(false),
  calibrationDate: z.string().optional(),
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
      id={`microscope-tabpanel-${index}`}
      aria-labelledby={`microscope-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function MicroscopeManagement() {
  const { showToast } = useToast();
  const [tabValue, setTabValue] = useState(0);
  const [microscopes, setMicroscopes] = useState<Microscope[]>([
    {
      id: "1",
      name: "Lab Microscope A",
      location: "Research Lab 1",
      model: "Olympus BX53",
      magnification: 1000,
      digitalOutput: true,
      calibrationDate: "2023-10-15",
      type: "microscope",
      status: "online",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Teaching Microscope",
      location: "Classroom 305",
      model: "Nikon E200",
      magnification: 400,
      digitalOutput: true,
      type: "microscope",
      status: "maintenance",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Quality Control Microscope",
      location: "Manufacturing Floor",
      model: "Zeiss Axio",
      magnification: 200,
      digitalOutput: false,
      calibrationDate: "2023-12-01",
      type: "microscope",
      status: "offline",
      lastUpdated: new Date().toISOString(),
    },
  ]);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMicroscope, setSelectedMicroscope] =
    useState<Microscope | null>(null);

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
      model: "",
      magnification: 100,
      digitalOutput: false,
      calibrationDate: "",
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
      model: "",
      magnification: 100,
      digitalOutput: false,
      calibrationDate: "",
      status: "online",
    },
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  function onCreateSubmit(values: z.infer<typeof formSchema>) {
    const newMicroscope: Microscope = {
      ...values,
      id: Date.now().toString(),
      type: "microscope",
      lastUpdated: new Date().toISOString(),
    };

    setMicroscopes([...microscopes, newMicroscope]);

    showToast(`${values.name} has been added to the system.`, "success");

    resetCreateForm();
    setTabValue(0); // Switch to list tab after adding
  }

  function openEditDialog(microscope: Microscope) {
    setSelectedMicroscope(microscope);
    resetEditForm({
      name: microscope.name,
      location: microscope.location,
      model: microscope.model,
      magnification: microscope.magnification,
      digitalOutput: microscope.digitalOutput,
      calibrationDate: microscope.calibrationDate || "",
      status: microscope.status,
    });
    setEditDialogOpen(true);
  }

  function onEditSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedMicroscope) return;

    const updatedMicroscopes = microscopes.map((microscope) =>
      microscope.id === selectedMicroscope.id
        ? {
            ...microscope,
            ...values,
            lastUpdated: new Date().toISOString(),
          }
        : microscope,
    );

    setMicroscopes(updatedMicroscopes);

    showToast(`${values.name}'s information has been updated.`, "success");

    setEditDialogOpen(false);
    setSelectedMicroscope(null);
  }

  function openDeleteDialog(microscope: Microscope) {
    setSelectedMicroscope(microscope);
    setDeleteDialogOpen(true);
  }

  function deleteMicroscope() {
    if (!selectedMicroscope) return;

    setMicroscopes(
      microscopes.filter(
        (microscope) => microscope.id !== selectedMicroscope.id,
      ),
    );

    showToast("The microscope has been removed from the system.", "success");

    setDeleteDialogOpen(false);
    setSelectedMicroscope(null);
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
        Microscope Management
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="microscope management tabs"
          sx={{ mb: 2 }}
        >
          <Tab label="Microscope List" />
          <Tab label="Register Microscope" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Card>
          <CardHeader
            title="Registered Microscopes"
            subheader="View and manage all microscopes in the system."
          />
          <CardContent>
            {microscopes.length === 0 ? (
              <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                No microscopes registered yet. Add a microscope to get started.
              </Typography>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Model</TableCell>
                      <TableCell>Magnification</TableCell>
                      <TableCell>Digital Output</TableCell>
                      <TableCell>Calibration Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right" width={120}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {microscopes.map((microscope) => (
                      <TableRow key={microscope.id}>
                        <TableCell component="th" scope="row">
                          {microscope.name}
                        </TableCell>
                        <TableCell>{microscope.location}</TableCell>
                        <TableCell>{microscope.model}</TableCell>
                        <TableCell>{microscope.magnification}x</TableCell>
                        <TableCell>
                          {microscope.digitalOutput ? "Yes" : "No"}
                        </TableCell>
                        <TableCell>
                          {microscope.calibrationDate || "Not calibrated"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={microscope.status}
                            color={
                              getStatusChipColor(microscope.status) as
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
                              onClick={() => openEditDialog(microscope)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              aria-label="delete"
                              color="error"
                              onClick={() => openDeleteDialog(microscope)}
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
            title="Register New Microscope"
            subheader="Add a new microscope to the system."
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
                      label="Microscope Name"
                      placeholder="Lab Microscope A"
                      error={!!createErrors.name}
                      helperText={
                        createErrors.name
                          ? createErrors.name.message
                          : "A descriptive name for the microscope."
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
                      placeholder="Research Lab 1"
                      error={!!createErrors.location}
                      helperText={
                        createErrors.location
                          ? createErrors.location.message
                          : "Where the microscope is installed."
                      }
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name="model"
                  control={createControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Model"
                      placeholder="Olympus BX53"
                      error={!!createErrors.model}
                      helperText={
                        createErrors.model
                          ? createErrors.model.message
                          : "The model of the microscope."
                      }
                      fullWidth
                    />
                  )}
                />

                <Box sx={{ display: "flex", gap: 3 }}>
                  <Controller
                    name="magnification"
                    control={createControl}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Magnification"
                        placeholder="1000"
                        error={!!createErrors.magnification}
                        helperText={
                          createErrors.magnification
                            ? createErrors.magnification.message
                            : "Maximum magnification level."
                        }
                        fullWidth
                      />
                    )}
                  />

                  <Controller
                    name="calibrationDate"
                    control={createControl}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="date"
                        label="Calibration Date"
                        InputLabelProps={{ shrink: true }}
                        helperText="Last calibration date (if applicable)."
                        fullWidth
                      />
                    )}
                  />
                </Box>

                <Box sx={{ display: "flex", gap: 3 }}>
                  <Controller
                    name="digitalOutput"
                    control={createControl}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        }
                        label="Digital Output"
                      />
                    )}
                  />

                  <Controller
                    name="status"
                    control={createControl}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel id="status-label">Status</InputLabel>
                        <Select
                          {...field}
                          labelId="status-label"
                          label="Status"
                        >
                          <MenuItem value="online">Online</MenuItem>
                          <MenuItem value="offline">Offline</MenuItem>
                          <MenuItem value="maintenance">Maintenance</MenuItem>
                        </Select>
                        <FormHelperText>
                          Current operational status of the microscope.
                        </FormHelperText>
                      </FormControl>
                    )}
                  />
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2, alignSelf: "flex-start" }}
                >
                  Register Microscope
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Microscope</DialogTitle>
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
                name="model"
                control={editControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Model"
                    error={!!editErrors.model}
                    helperText={editErrors.model?.message}
                    fullWidth
                  />
                )}
              />

              <Box sx={{ display: "flex", gap: 3 }}>
                <Controller
                  name="magnification"
                  control={editControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Magnification"
                      error={!!editErrors.magnification}
                      helperText={editErrors.magnification?.message}
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name="calibrationDate"
                  control={editControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="date"
                      label="Calibration Date"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  )}
                />
              </Box>

              <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
                <Controller
                  name="digitalOutput"
                  control={editControl}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                      label="Digital Output"
                    />
                  )}
                />

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
        <DialogTitle>Delete Microscope</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedMicroscope?.name}? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={deleteMicroscope} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
