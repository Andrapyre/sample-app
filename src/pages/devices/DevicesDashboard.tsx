import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Paper,
  Divider,
  Button,
  useTheme,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  CameraAlt as CameraIcon,
  Science as MicroscopeIcon,
  Sensors as SensorIcon,
  Add as AddIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { fetchDevices } from "@/store/slices/deviceSlice";

export default function DevicesDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { devices, stats, dataTransmission } = useAppSelector(
    (state) => state.devices,
  );

  // Get the 3 most recent devices
  const recentDevices = [...devices]
    .sort(
      (a, b) =>
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime(),
    )
    .slice(0, 3);

  // Fetch device data
  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  const getStatusColor = (status: string) => {
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

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "camera":
        return <CameraIcon sx={{ fontSize: 40 }} color="primary" />;
      case "microscope":
        return <MicroscopeIcon sx={{ fontSize: 40 }} color="primary" />;
      case "sensor":
        return <SensorIcon sx={{ fontSize: 40 }} color="primary" />;
      default:
        return <DashboardIcon sx={{ fontSize: 40 }} color="primary" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const navigateToDeviceType = (type: string) => {
    switch (type) {
      case "camera":
        navigate("/devices/cameras");
        break;
      case "microscope":
        navigate("/devices/microscopes");
        break;
      case "sensor":
        navigate("/devices/sensors");
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h3" component="h1">
          Devices Dashboard
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => navigate("/devices/cameras")}
          >
            Add Camera
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => navigate("/devices/microscopes")}
          >
            Add Microscope
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => navigate("/devices/sensors")}
          >
            Add Sensor
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Total Devices
            </Typography>
            <Typography variant="h3" color="primary">
              {stats.total}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Online
            </Typography>
            <Typography variant="h3" color="success.main">
              {stats.online}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Offline
            </Typography>
            <Typography variant="h3" color="error.main">
              {stats.offline}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Maintenance
            </Typography>
            <Typography variant="h3" color="warning.main">
              {stats.maintenance}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Device Type Cards */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Device Categories
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardActionArea onClick={() => navigateToDeviceType("camera")}>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 3,
                }}
              >
                <CameraIcon sx={{ fontSize: 60, mb: 2 }} color="primary" />
                <Typography variant="h5" gutterBottom>
                  Cameras
                </Typography>
                <Typography variant="h4" color="primary.main">
                  {stats.cameras}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Manage security cameras and video devices
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardActionArea onClick={() => navigateToDeviceType("microscope")}>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 3,
                }}
              >
                <MicroscopeIcon sx={{ fontSize: 60, mb: 2 }} color="primary" />
                <Typography variant="h5" gutterBottom>
                  Microscopes
                </Typography>
                <Typography variant="h4" color="primary.main">
                  {stats.microscopes}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Manage digital microscopes for research and quality control
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardActionArea onClick={() => navigateToDeviceType("sensor")}>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 3,
                }}
              >
                <SensorIcon sx={{ fontSize: 60, mb: 2 }} color="primary" />
                <Typography variant="h5" gutterBottom>
                  Sensors
                </Typography>
                <Typography variant="h4" color="primary.main">
                  {stats.sensors}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Manage environmental and monitoring sensors
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>

      {/* Data Transmission Graph */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Data Transmission Over Last 24 Hours (GB/s)
      </Typography>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <ResponsiveContainer width="100%" height={600}>
          <LineChart
            data={dataTransmission}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis
              label={{ value: "GB/s", angle: -90, position: "insideLeft" }}
              domain={[0, "auto"]}
            />
            <Tooltip formatter={(value) => [`${value} GB/s`, "Data Rate"]} />
            <Legend />
            <Line
              type="monotone"
              dataKey="cameras"
              name="Cameras"
              stroke={theme.palette.primary.main}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="microscopes"
              name="Microscopes"
              stroke={theme.palette.success.main}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="sensors"
              name="Sensors"
              stroke={theme.palette.warning.main}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* Recent Devices */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Recently Updated Devices
      </Typography>
      <Paper elevation={2} sx={{ p: 3 }}>
        {recentDevices.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            No devices found. Add a device to get started.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {recentDevices.map((device) => (
              <Grid item xs={12} md={4} key={device.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      {getDeviceIcon(device.type)}
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="h6">{device.name}</Typography>
                        <Chip
                          label={device.status}
                          color={
                            getStatusColor(device.status) as
                              | "success"
                              | "error"
                              | "warning"
                              | "default"
                          }
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Location: {device.location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated: {formatDate(device.lastUpdated)}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Button
                        size="small"
                        onClick={() => navigateToDeviceType(device.type)}
                      >
                        Manage {device.type}s
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
}
