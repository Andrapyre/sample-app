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
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useToast } from "@/components/layout/Layout";

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
});

type Camera = z.infer<typeof formSchema> & { id: string };

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
    },
    {
      id: "2",
      name: "Parking Lot Camera",
      location: "North Parking",
      ipAddress: "192.168.1.101",
    },
    {
      id: "3",
      name: "Warehouse Camera",
      location: "Storage Area",
      ipAddress: "192.168.1.102",
    },
  ]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cameraToDelete, setCameraToDelete] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      ipAddress: "",
    },
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newCamera = {
      ...values,
      id: Date.now().toString(),
    };

    setCameras([...cameras, newCamera]);

    showToast(`${values.name} has been added to the system.`, "success");

    reset();
    setTabValue(0); // Switch to list tab after adding
  }

  function openDeleteDialog(id: string) {
    setCameraToDelete(id);
    setDeleteDialogOpen(true);
  }

  function deleteCamera() {
    if (cameraToDelete) {
      setCameras(cameras.filter((camera) => camera.id !== cameraToDelete));
      showToast("The camera has been removed from the system.", "success");
      setDeleteDialogOpen(false);
      setCameraToDelete(null);
    }
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
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
                      <TableCell align="right" width={100}>
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
                        <TableCell align="right">
                          <IconButton
                            aria-label="delete"
                            color="error"
                            onClick={() => openDeleteDialog(camera.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Camera Name"
                      placeholder="Front Door Camera"
                      error={!!errors.name}
                      helperText={
                        errors.name
                          ? errors.name.message
                          : "A descriptive name for the camera."
                      }
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Location"
                      placeholder="Main Entrance"
                      error={!!errors.location}
                      helperText={
                        errors.location
                          ? errors.location.message
                          : "Where the camera is installed."
                      }
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name="ipAddress"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="IP Address"
                      placeholder="192.168.1.100"
                      error={!!errors.ipAddress}
                      helperText={
                        errors.ipAddress
                          ? errors.ipAddress.message
                          : "The IP address of the camera on the network."
                      }
                      fullWidth
                    />
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

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Camera</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this camera? This action cannot be
            undone.
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
